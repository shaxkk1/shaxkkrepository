import pygame
import random
import sys
import math
import time

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 800
GRID_SIZE = 20
GRID_WIDTH = WIDTH // GRID_SIZE
GRID_HEIGHT = HEIGHT // GRID_SIZE
FPS = 10
# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
YELLOW = (255, 255, 0)
PURPLE = (128, 0, 128)
CYAN = (0, 255, 255)
ORANGE = (255, 165, 0)
PINK = (255, 192, 203)
HOT_PINK = (255, 20, 147)
GOLD = (255, 215, 0)
LIME_GREEN = (50, 205, 50)
BROWN = (139, 69, 19)
GRAY = (128, 128, 128)
DARK_BLUE = (0, 0, 139)
ICE_BLUE = (188, 212, 230)
MUD_BROWN = (94, 75, 30)
SAND_YELLOW = (194, 178, 128)
# AI Bot Colors
AI_COLORS = [YELLOW, PURPLE, CYAN, ORANGE, PINK]
# Terrain types and their effects
TERRAIN_TYPES = {
    "normal": {"color": BLACK, "speed_modifier": 0, "control_modifier": 0},
    "ice": {"color": ICE_BLUE, "speed_modifier": 2, "control_modifier": -0.3},
    "mud": {"color": MUD_BROWN, "speed_modifier": -2, "control_modifier": 0},
    "sand": {"color": SAND_YELLOW, "speed_modifier": -1, "control_modifier": 0}
}
# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)
class Snake:
    def __init__(self, start_pos=None, color=GREEN, is_player=True):
        self.is_player = is_player
        self.color = color
        self.start_pos = start_pos
        self.reset()
        
    def reset(self):
        self.length = 1
        if self.start_pos:
            self.positions = [self.start_pos]
        else:
            self.positions = [((GRID_WIDTH // 2), (GRID_HEIGHT // 2))]
        self.direction = random.choice([UP, DOWN, LEFT, RIGHT])
        self.score = 0
        self.alive = True
        
        # Add powerup effects
        self.has_shield = False
        self.shield_end_time = 0
        self.speed_boost = 0
        self.speed_boost_end_time = 0
        self.score_multiplier = 1
        self.score_multiplier_end_time = 0
        
        # Terrain tracking
        self.last_terrain_check = time.time()
        self.current_terrain = "normal"
        
    def get_head_position(self):
        return self.positions[0]
    
    def change_direction(self, direction):
        if (direction[0] * -1, direction[1] * -1) != self.direction:
            self.direction = direction
            
    def move(self, all_snake_positions=None, terrain_manager=None, obstacle_manager=None):
        if not self.alive:
            return True
            
        head = self.get_head_position()
        x, y = self.direction
        
        # Check for terrain effects if terrain manager exists
        speed_modifier = 0
        control_modifier = 0
        if terrain_manager and hasattr(self, 'last_terrain_check'):
            terrain_type = terrain_manager.get_terrain_at(head)
            if terrain_type:
                speed_modifier = TERRAIN_TYPES[terrain_type]["speed_modifier"]
                control_modifier = TERRAIN_TYPES[terrain_type]["control_modifier"]
                # Store terrain info for future reference
                self.last_terrain_check = time.time()
                self.current_terrain = terrain_type
                
                # If on ice, random chance of slipping (reduced control)
                if terrain_type == "ice" and random.random() < abs(control_modifier):
                    # Randomly change direction
                    possible_dirs = [UP, DOWN, LEFT, RIGHT]
                    possible_dirs.remove((x * -1, y * -1))  # Remove opposite direction
                    self.direction = random.choice(possible_dirs)
                    x, y = self.direction
        
        new_x = (head[0] + x)
        new_y = (head[1] + y)
        new_position = (new_x, new_y)
        
        # Check for wall collision
        if new_x < 0 or new_x >= GRID_WIDTH or new_y < 0 or new_y >= GRID_HEIGHT:
            self.alive = False
            return False  # Game over - snake hit wall
            
        # Check for obstacle collision if obstacle manager exists
        if obstacle_manager and obstacle_manager.is_obstacle_at(new_position):
            self.alive = False
            return False  # Game over - snake hit obstacle
        
        # Check for self collision
        if new_position in self.positions[1:]:
            self.alive = False
            return False  # Game over - snake hit itself
            
        # Check for collision with other snakes
        if all_snake_positions:
            for pos in all_snake_positions:
                if pos != self.positions and new_position in pos:
                    self.alive = False
                    return False  # Game over - snake hit another snake
        
        self.positions.insert(0, new_position)
        if len(self.positions) > self.length:
            self.positions.pop()
            
        return True  # Game continues
    
    def grow(self, growth=1, points=1):
        self.length += growth
        # Apply score multiplier if active
        if hasattr(self, 'score_multiplier') and time.time() < getattr(self, 'score_multiplier_end_time', 0):
            self.score += points * self.score_multiplier
        else:
            self.score += points
        
    def draw(self, surface):
        if not self.alive:
            return
            
        for i, position in enumerate(self.positions):
            rect = pygame.Rect((position[0] * GRID_SIZE, position[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
            if i == 0:  # Head
                head_color = BLUE if self.is_player else WHITE
                pygame.draw.rect(surface, head_color, rect)
            else:  # Body
                pygame.draw.rect(surface, self.color, rect)
            pygame.draw.rect(surface, BLACK, rect, 1)
            
        # Draw shield effect if active
        if hasattr(self, 'has_shield') and self.has_shield and time.time() < self.shield_end_time:
            head_pos = self.get_head_position()
            shield_rect = pygame.Rect(
                (head_pos[0] * GRID_SIZE - 4, head_pos[1] * GRID_SIZE - 4),
                (GRID_SIZE + 8, GRID_SIZE + 8)
            )
            pygame.draw.rect(surface, CYAN, shield_rect, 2)
            
        # Draw speed boost effect if active
        if hasattr(self, 'speed_boost') and self.speed_boost > 0 and time.time() < self.speed_boost_end_time:
            head_pos = self.get_head_position()
            # Draw little speed lines behind the snake
            if len(self.positions) > 1:
                direction = self.direction
                # Calculate position behind the snake
                behind_x = head_pos[0] - direction[0]
                behind_y = head_pos[1] - direction[1]
                # Draw speed lines
                for i in range(1, 4):
                    offset_x = random.randint(-3, 3)
                    offset_y = random.randint(-3, 3)
                    start_x = (behind_x * GRID_SIZE) + (GRID_SIZE // 2) + offset_x
                    start_y = (behind_y * GRID_SIZE) + (GRID_SIZE // 2) + offset_y
                    end_x = start_x - (direction[0] * GRID_SIZE // 2)
                    end_y = start_y - (direction[1] * GRID_SIZE // 2)
                    pygame.draw.line(surface, YELLOW, (start_x, start_y), (end_x, end_y), 2)
                    
        # Draw score multiplier effect if active
        if hasattr(self, 'score_multiplier') and self.score_multiplier > 1 and time.time() < self.score_multiplier_end_time:
            head_pos = self.get_head_position()
            # Draw a small multiplier indicator
            multiplier_text = f"{self.score_multiplier}x"
            font = pygame.font.SysFont('Arial', 12)
            text_surface = font.render(multiplier_text, True, GOLD)
            text_rect = text_surface.get_rect()
            text_rect.center = (head_pos[0] * GRID_SIZE + GRID_SIZE // 2, 
                               head_pos[1] * GRID_SIZE - 10)
            surface.blit(text_surface, text_rect)

class AISnake(Snake):
    def __init__(self, strategy, start_pos=None, color=YELLOW):
        super().__init__(start_pos=start_pos, color=color, is_player=False)
        self.strategy = strategy
        self.name = f"AI-{strategy.capitalize()}"
        # Add talking functionality to all AI snakes
        self.sayings = self._get_sayings_by_strategy()
        self.current_saying = random.choice(self.sayings) if self.sayings else ""
        self.last_saying_change = time.time()
        self.saying_duration = 5  # Change saying every 5 seconds
        
    def _get_sayings_by_strategy(self):
        """Return a list of sayings appropriate for this snake's strategy"""
        strategy_sayings = {
            "food": [
                "Food! I need more food!",
                "Is that a snack I see?",
                "I'm starving over here!",
                "Mmm, delicious pixels!",
                "Feed me, Seymour!",
                "My diet plan: eat everything!",
                "Buffet time!",
                "My stomach is growling!",
                "That looks tasty!",
                "Food is life!"
            ],
            "cautious": [
                "Better safe than sorry...",
                "Is it safe to go there?",
                "I have a bad feeling about this",
                "Proceed with caution!",
                "Danger, danger!",
                "I should probably avoid that",
                "Safety first!",
                "Looking both ways before crossing",
                "I'm not scared, just... cautious",
                "Better think twice about this"
            ],
            "aggressive": [
                "Out of my way!",
                "Coming through!",
                "I'm winning this game!",
                "Victory shall be mine!",
                "No mercy for the weak!",
                "I'm the boss snake here!",
                "Watch me dominate!",
                "First place or nothing!",
                "Speed and power!",
                "Fear my slithering might!"
            ],
            "hunter": [
                "I can smell fear...",
                "You can run, but you can't hide",
                "Target acquired!",
                "The hunt is on!",
                "Prey spotted!",
                "I love a good chase",
                "Time for the predator to feast",
                "Tracking my next meal",
                "Nowhere to run",
                "The perfect ambush"
            ],
            "random": [
                "Which way is up again?",
                "I'm not lost... the map is!",
                "Oops, didn't mean to go there",
                "Is this the right way?",
                "Wheeeeee!",
                "What am I doing again?",
                "Squirrel!",
                "I forgot how to snake",
                "Wait, where was I going?",
                "Look, a shiny thing!"
            ]
        }
        
        return strategy_sayings.get(self.strategy, [])
    
    def update_saying(self):
        """Update the current saying based on time"""
        if not self.sayings:
            return
            
        current_time = time.time()
        if current_time - self.last_saying_change > self.saying_duration:
            self.current_saying = random.choice(self.sayings)
            self.last_saying_change = current_time
    
    def think(self, food_manager, snakes):
        """Determine next move based on the AI strategy"""
        if not self.alive:
            return
            
        # Update the current saying
        self.update_saying()
            
        head = self.get_head_position()
        
        # Find the closest food or one with highest value based on strategy
        closest_food_position = self._find_best_food(food_manager)
        
        # Get all occupied positions from all snakes
        all_positions = []
        for snake in snakes:
            if snake != self and snake.alive:
                all_positions.extend(snake.positions)
        
        # Add positions that would hit a wall
        wall_positions = []
        for x in range(-1, GRID_WIDTH + 1):
            for y in [-1, GRID_HEIGHT]:
                wall_positions.append((x, y))
        for y in range(0, GRID_HEIGHT):
            for x in [-1, GRID_WIDTH]:
                wall_positions.append((x, y))
        
        all_positions.extend(wall_positions)
                
        # Strategy: Follow food
        if self.strategy == "food":
            self._follow_food_strategy(head, closest_food_position, all_positions)
        
        # Strategy: Avoid walls and other snakes
        elif self.strategy == "cautious":
            self._cautious_strategy(head, closest_food_position, all_positions)
            
        # Strategy: Aggressive - follow food but consider direct paths
        elif self.strategy == "aggressive":
            self._aggressive_strategy(head, closest_food_position, all_positions)
    def think(self, food_manager, snakes):
        """Determine next move based on the AI strategy"""
        if not self.alive:
            return
            
        head = self.get_head_position()
        
        # Find the closest food or one with highest value based on strategy
        closest_food_position = self._find_best_food(food_manager)
        
        # Get all occupied positions from all snakes
        all_positions = []
        for snake in snakes:
            if snake != self and snake.alive:
                all_positions.extend(snake.positions)
        
        # Add positions that would hit a wall
        wall_positions = []
        for x in range(-1, GRID_WIDTH + 1):
            for y in [-1, GRID_HEIGHT]:
                wall_positions.append((x, y))
        for y in range(0, GRID_HEIGHT):
            for x in [-1, GRID_WIDTH]:
                wall_positions.append((x, y))
        
        all_positions.extend(wall_positions)
                
        # Strategy: Follow food
        if self.strategy == "food":
            self._follow_food_strategy(head, closest_food_position, all_positions)
        
        # Strategy: Avoid walls and other snakes
        elif self.strategy == "cautious":
            self._cautious_strategy(head, closest_food_position, all_positions)
            
        # Strategy: Aggressive - follow food but consider direct paths
        elif self.strategy == "aggressive":
            self._aggressive_strategy(head, closest_food_position, all_positions)
    
    def _find_best_food(self, food_manager):
        """Find the optimal food target based on strategy"""
        head = self.get_head_position()
        best_food = None
        best_score = float('-inf')
        
        # Check if there are any foods available
        if not food_manager.foods:
            return (GRID_WIDTH // 2, GRID_HEIGHT // 2)
            
        for food in food_manager.foods:
            distance = abs(head[0] - food.position[0]) + abs(head[1] - food.position[1])
            
            # Default score in case strategy doesn't match any case
            score = -distance
            
            # Different strategies prioritize food differently
            if self.strategy == "food":
                # Simple strategy: closest food
                score = -distance
            elif self.strategy == "cautious":
                # Cautious strategy: balance between value and distance
                score = food.points - (distance * 0.5)
            elif self.strategy == "aggressive":
                # Aggressive strategy: prioritize high-value food
                score = (food.points * 2) - distance
            elif self.strategy == "hunter":
                # Hunter strategy: similar to aggressive but with higher distance penalty
                score = food.points - distance
                
            if score > best_score:
                best_score = score
                best_food = food
        
        # If no food is found, return a default position
        return best_food.position if best_food else (GRID_WIDTH // 2, GRID_HEIGHT // 2)
            
    def _follow_food_strategy(self, head, food_position, obstacles):
        """Simple strategy to move toward food"""
        directions = [UP, DOWN, LEFT, RIGHT]
        best_direction = self.direction
        
        # Calculate distances for each potential move
        min_distance = float('inf')
        for dir in directions:
            new_pos = (head[0] + dir[0], head[1] + dir[1])
            
            # Skip if the move hits something
            if new_pos in self.positions[1:] or new_pos in obstacles:
                continue
                
            # Skip if move is opposite to current direction
            if (dir[0] * -1, dir[1] * -1) == self.direction:
                continue
                
            # Calculate Manhattan distance to food
            distance = abs(new_pos[0] - food_position[0]) + abs(new_pos[1] - food_position[1])
            
            if distance < min_distance:
                min_distance = distance
                best_direction = dir
                
        self.direction = best_direction
        
    def _cautious_strategy(self, head, food_position, obstacles):
        """Move toward food while prioritizing safety"""
        directions = [UP, DOWN, LEFT, RIGHT]
        possible_moves = []
        
        for dir in directions:
            new_pos = (head[0] + dir[0], head[1] + dir[1])
            
            # Skip if the move hits something or is opposite current direction
            if new_pos in self.positions[1:] or new_pos in obstacles or (dir[0] * -1, dir[1] * -1) == self.direction:
                continue
                
            # Check how many open spaces are available from this move
            open_spaces = 0
            for next_dir in directions:
                next_pos = (new_pos[0] + next_dir[0], new_pos[1] + next_dir[1])
                if next_pos not in obstacles and next_pos not in self.positions:
                    open_spaces += 1
            
            # Calculate Manhattan distance to food
            distance = abs(new_pos[0] - food_position[0]) + abs(new_pos[1] - food_position[1])
            
            # Score this move (prioritize open spaces, then distance to food)
            score = open_spaces * 10 - distance
            possible_moves.append((dir, score))
            
        if possible_moves:
            # Sort by score (higher is better)
            possible_moves.sort(key=lambda x: x[1], reverse=True)
            self.direction = possible_moves[0][0]
        else:
            # If no good move is found, just try to avoid immediate collision
            for dir in directions:
                new_pos = (head[0] + dir[0], head[1] + dir[1])
                if new_pos not in self.positions[1:] and (dir[0] * -1, dir[1] * -1) != self.direction:
                    self.direction = dir
                    break
    
    def _aggressive_strategy(self, head, food_position, obstacles):
        """Aggressively pursue food with less regard for safety"""
        directions = [UP, DOWN, LEFT, RIGHT]
        possible_moves = []
        
        # Calculate direct vector to food
        direct_x = food_position[0] - head[0]
        direct_y = food_position[1] - head[1]
        
        for dir in directions:
            new_pos = (head[0] + dir[0], head[1] + dir[1])
            
            # Skip if the move hits something or is opposite current direction
            if new_pos in self.positions[1:] or new_pos in obstacles or (dir[0] * -1, dir[1] * -1) == self.direction:
                continue
                
            # Calculate how aligned this move is with direct path to food
            alignment = 0
            if (direct_x > 0 and dir == RIGHT) or (direct_x < 0 and dir == LEFT):
                alignment += 1
            if (direct_y > 0 and dir == DOWN) or (direct_y < 0 and dir == UP):
                alignment += 1
                
            # Calculate Manhattan distance to food
            distance = abs(new_pos[0] - food_position[0]) + abs(new_pos[1] - food_position[1])
            
            # Score this move (prioritize alignment with direct path, then distance)
            score = alignment * 5 - distance
            possible_moves.append((dir, score))
            
        if possible_moves:
            # Sort by score (higher is better)
            possible_moves.sort(key=lambda x: x[1], reverse=True)
            self.direction = possible_moves[0][0]
        else:
            # If no good move is found, just try to avoid immediate collision
            for dir in directions:
                new_pos = (head[0] + dir[0], head[1] + dir[1])
                if new_pos not in self.positions[1:] and (dir[0] * -1, dir[1] * -1) != self.direction:
                    self.direction = dir
                    break
                    
class HunterSnake(AISnake):
    def __init__(self, start_pos=None, color=ORANGE, hunter_id=1, partner=None):
        super().__init__(strategy="hunter", start_pos=start_pos, color=color)
        self.hunter_id = hunter_id
        self.name = f"Hunter-{hunter_id}"
        self.partner = partner
        # Used for target selection - how far a potential target can be
        self.target_range = 15
        # The snake this hunter is currently targeting
        self.target_snake = None
        # Time since target was last seen
        self.target_timer = 0
        
    def set_partner(self, partner):
        """Set the partner HunterSnake for coordination"""
        self.partner = partner
        
    def think(self, food_manager, snakes):
        """Coordinated hunting behavior to eliminate other snakes"""
        if not self.alive:
            return
        
        # Update saying first (from parent class)
        self.update_saying()
            
        # Get head position
        head = self.get_head_position()
        
        # All possible movements
        directions = [UP, DOWN, LEFT, RIGHT]
        
        # Get all obstacles (walls and snake bodies)
        obstacles = []
        for snake in snakes:
            if snake != self and snake.alive:
                obstacles.extend(snake.positions)
                
        # Add wall positions
        for x in range(-1, GRID_WIDTH + 1):
            for y in [-1, GRID_HEIGHT]:
                obstacles.append((x, y))
        for y in range(0, GRID_HEIGHT):
            for x in [-1, GRID_WIDTH]:
                obstacles.append((x, y))
                
        # Find a target snake if we don't have one or the current one is dead
        if (self.target_snake is None or not self.target_snake.alive or 
            self.target_timer > 20):  # Reset target after 20 turns
            self.target_snake = self._select_target(snakes)
            self.target_timer = 0
        else:
            self.target_timer += 1
            
        # If we have a target and partner, coordinate to trap it
        if self.target_snake and self.partner and self.target_snake.alive:
            target_head = self.target_snake.get_head_position()
            partner_head = self.partner.get_head_position()
            
            # Calculate vectors
            to_target = (target_head[0] - head[0], target_head[1] - head[1])
            partner_to_target = (target_head[0] - partner_head[0], target_head[1] - partner_head[1])
            
            # Distance to target
            distance_to_target = abs(to_target[0]) + abs(to_target[1])
            
            # If snake 1, try to get in front of the target snake
            if self.hunter_id == 1 and distance_to_target < self.target_range:
                self._intercept_strategy(head, target_head, self.target_snake.direction, obstacles)
            # If snake 2, try to approach from another angle to trap
            elif self.hunter_id == 2 and distance_to_target < self.target_range:
                self._flank_strategy(head, target_head, partner_head, obstacles)
            else:
                # If target is too far, go for food
                closest_food_position = self._find_best_food(food_manager)
                self._follow_food_strategy(head, closest_food_position, obstacles)
        else:
            # If no target, go for food to grow
            closest_food_position = self._find_best_food(food_manager)
            self._follow_food_strategy(head, closest_food_position, obstacles)
            
    def _select_target(self, snakes):
        """Select the best snake to target"""
        head = self.get_head_position()
        best_target = None
        best_score = float('inf')
        
        for snake in snakes:
            # Don't target yourself, your partner, or dead snakes
            if snake == self or snake == self.partner or not snake.alive:
                continue
                
            target_head = snake.get_head_position()
            distance = abs(head[0] - target_head[0]) + abs(head[1] - target_head[1])
            
            # Consider shorter snakes as easier targets
            target_score = distance * (0.5 + snake.length/20)
            
            if target_score < best_score and distance < self.target_range:
                best_score = target_score
                best_target = snake
                
        return best_target
        
    def _intercept_strategy(self, head, target_head, target_direction, obstacles):
        """Try to get in front of the target snake to cut it off"""
        directions = [UP, DOWN, LEFT, RIGHT]
        possible_moves = []
        
        # Predict where the target is likely to go
        predicted_x = target_head[0] + target_direction[0] * 2
        predicted_y = target_head[1] + target_direction[1] * 2
        predicted_pos = (predicted_x, predicted_y)
        
        for dir in directions:
            new_pos = (head[0] + dir[0], head[1] + dir[1])
            
            # Skip if the move hits something or is opposite current direction
            if new_pos in self.positions or new_pos in obstacles or (dir[0] * -1, dir[1] * -1) == self.direction:
                continue
                
            # Calculate distance to predicted position
            distance = abs(new_pos[0] - predicted_pos[0]) + abs(new_pos[1] - predicted_pos[1])
            
            # Score moves that get us in front of the target higher
            score = -distance
            possible_moves.append((dir, score))
            
        if possible_moves:
            # Sort by score (higher is better)
            possible_moves.sort(key=lambda x: x[1], reverse=True)
            self.direction = possible_moves[0][0]
        else:
            # If no good move, just avoid collision
            for dir in directions:
                new_pos = (head[0] + dir[0], head[1] + dir[1])
                if new_pos not in self.positions and (dir[0] * -1, dir[1] * -1) != self.direction:
                    self.direction = dir
                    break
    
    def _flank_strategy(self, head, target_head, partner_head, obstacles):
        """Try to approach the target from a different angle than the partner"""
        directions = [UP, DOWN, LEFT, RIGHT]
        possible_moves = []
        
        # Vector from partner to target
        partner_to_target = (target_head[0] - partner_head[0], target_head[1] - partner_head[1])
        
        for dir in directions:
            new_pos = (head[0] + dir[0], head[1] + dir[1])
            
            # Skip if the move hits something or is opposite current direction
            if new_pos in self.positions or new_pos in obstacles or (dir[0] * -1, dir[1] * -1) == self.direction:
                continue
                
            # Vector from potential new position to target
            new_to_target = (target_head[0] - new_pos[0], target_head[1] - new_pos[1])
            
            # We want to approach from a different angle than partner
            # Calculate dot product - lower means more perpendicular approach
            if partner_to_target[0] == 0 and partner_to_target[1] == 0:
                dot_product = 0  # Avoid division by zero
            else:
                norm1 = math.sqrt(partner_to_target[0]**2 + partner_to_target[1]**2)
                norm2 = math.sqrt(new_to_target[0]**2 + new_to_target[1]**2)
                if norm1 == 0 or norm2 == 0:
                    dot_product = 0
                else:
                    dot_product = abs((partner_to_target[0] * new_to_target[0] + 
                                      partner_to_target[1] * new_to_target[1]) / (norm1 * norm2))
            
            # Distance to target
            distance = abs(new_pos[0] - target_head[0]) + abs(new_pos[1] - target_head[1])
            
            # Score: prioritize perpendicular approach (low dot product) and closeness
            score = (1 - dot_product) * 10 - distance
            possible_moves.append((dir, score))
            
        if possible_moves:
            # Sort by score (higher is better)
            possible_moves.sort(key=lambda x: x[1], reverse=True)
            self.direction = possible_moves[0][0]
        else:
            # If no good move, just avoid collision
            for dir in directions:
                new_pos = (head[0] + dir[0], head[1] + dir[1])
                if new_pos not in self.positions and (dir[0] * -1, dir[1] * -1) != self.direction:
                    self.direction = dir
                    break

class TalkativeAISnake(AISnake):
    def __init__(self, start_pos=None, color=PINK):
        super().__init__(strategy="food", start_pos=start_pos, color=color)
        self.name = "Jinu F Jung"
        # Override the sayings with Jinu's unique ones
        self.sayings = [
            "I'm not lost, I'm taking a scenic route!",
            "Is this snake diet working? I can't tell.",
            "I'm not slithering, I'm doing snake yoga!",
            "Did you know snakes don't have arms? That's why we can't high five!",
            "I'm not hissing at you, I'm just saying hi in snake language!",
            "If I were in Slytherin, I'd be the house pet.",
            "I don't have legs, but I still run the game!",
            "This is my interpretive dance. What do you think?",
            "Anyone seen my snake charmer? I miss the music.",
            "I'm not long, I'm vertically challenged horizontally!",
            "My life motto: Keep calm and slither on!",
            "Plot twist: I'm actually a very long lizard without legs.",
            "I may be cold-blooded, but I've got a warm heart!",
            "My favorite movie? Snakes on a Plane, obviously!",
            "I don't shed tears, I shed skin. It's more dramatic!",
        ]
        self.current_saying = random.choice(self.sayings)
        self.last_saying_change = time.time()

class ZeroIQSnake(AISnake):
    def __init__(self, start_pos=None, color=HOT_PINK):
        super().__init__(strategy="random", start_pos=start_pos, color=color)
        self.name = "DerpySnake"
        
    def think(self, food_manager, snakes):
        """Make completely random moves with no strategy or collision avoidance"""
        if not self.alive:
            return
        
        # Update saying first (from parent class)
        self.update_saying()
            
        # List of all possible directions
        directions = [UP, DOWN, LEFT, RIGHT]
        
        # 20% chance to randomly change direction even when not necessary
        if random.random() < 0.2:
            # Choose a random direction that isn't opposite to current direction
            possible_dirs = [d for d in directions if d != (self.direction[0] * -1, self.direction[1] * -1)]
            if possible_dirs:
                self.direction = random.choice(possible_dirs)
            return
            
        # Otherwise, just choose a random direction that isn't opposite to current
        possible_dirs = [d for d in directions if d != (self.direction[0] * -1, self.direction[1] * -1)]
        if possible_dirs:
            self.direction = random.choice(possible_dirs)
class Obstacle:
    # Define obstacle types with their properties: (color, name, description)
    OBSTACLE_TYPES = {
        "rock": (GRAY, "Rock", "Solid rock that blocks movement"),
        "water": (DARK_BLUE, "Water", "Deep water that drowns snakes"),
        "spikes": (RED, "Spikes", "Sharp spikes that impale snakes"),
        "lava": (ORANGE, "Lava", "Hot lava that burns snakes")
    }
    
    def __init__(self, position, obstacle_type="rock"):
        self.position = position
        self.type = obstacle_type
        self.color, self.name, self.description = self.OBSTACLE_TYPES[obstacle_type]
        
    def draw(self, surface):
        rect = pygame.Rect((self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(surface, self.color, rect)
        # Draw different visuals based on obstacle type
        if self.type == "rock":
            # Draw rock texture (gray with dark outlines)
            pygame.draw.rect(surface, BLACK, rect, 1)
            # Draw some lines to give rocky texture
            start_x = self.position[0] * GRID_SIZE + random.randint(3, GRID_SIZE-3)
            start_y = self.position[1] * GRID_SIZE + random.randint(3, GRID_SIZE-3)
            end_x = start_x + random.randint(-5, 5)
            end_y = start_y + random.randint(-5, 5)
            pygame.draw.line(surface, BLACK, (start_x, start_y), (end_x, end_y), 1)
        elif self.type == "water":
            # Draw water texture (blue with wave-like pattern)
            pygame.draw.rect(surface, BLACK, rect, 1)
            # Draw some wavy lines to simulate water
            wave_height = 3
            for y_offset in range(4, GRID_SIZE, 4):
                for x_offset in range(0, GRID_SIZE, 4):
                    start_x = self.position[0] * GRID_SIZE + x_offset
                    start_y = self.position[1] * GRID_SIZE + y_offset
                    end_x = start_x + 4
                    end_y = start_y + random.randint(-wave_height, wave_height)
                    pygame.draw.line(surface, BLUE, (start_x, start_y), (end_x, end_y), 1)
        elif self.type == "spikes":
            # Draw spike texture (red triangles)
            pygame.draw.rect(surface, BLACK, rect, 1)
            # Draw triangular spikes
            for i in range(4):
                spike_x = self.position[0] * GRID_SIZE + 5 + i * 4
                spike_y_top = self.position[1] * GRID_SIZE + 3
                spike_y_bottom = self.position[1] * GRID_SIZE + GRID_SIZE - 3
                # Draw top spike
                pygame.draw.polygon(surface, RED, [
                    (spike_x, spike_y_top),
                    (spike_x - 3, spike_y_top + 5),
                    (spike_x + 3, spike_y_top + 5)
                ])
                # Draw bottom spike
                pygame.draw.polygon(surface, RED, [
                    (spike_x, spike_y_bottom),
                    (spike_x - 3, spike_y_bottom - 5),
                    (spike_x + 3, spike_y_bottom - 5)
                ])
        elif self.type == "lava":
            # Draw lava texture (orange with yellow highlights)
            pygame.draw.rect(surface, BLACK, rect, 1)
            # Draw lava bubbles
            for i in range(3):
                bubble_x = self.position[0] * GRID_SIZE + random.randint(4, GRID_SIZE-4)
                bubble_y = self.position[1] * GRID_SIZE + random.randint(4, GRID_SIZE-4)
                bubble_radius = random.randint(2, 4)
                pygame.draw.circle(surface, YELLOW, (bubble_x, bubble_y), bubble_radius)

class ObstacleManager:
    def __init__(self):
        self.obstacles = []
        self.obstacle_density = 0.03  # 3% of the grid will be obstacles
        
    def initialize_obstacles(self, occupied_positions):
        """Create initial obstacles on the map."""
        num_obstacles = int(GRID_WIDTH * GRID_HEIGHT * self.obstacle_density)
        
        # Obstacle types with their distribution weights
        obstacle_types = ["rock", "water", "spikes", "lava"]
        obstacle_weights = [10, 5, 3, 2]  # Higher weight = more common
        
        for _ in range(num_obstacles):
            # Randomly choose position and type for obstacle
            pos = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
            
            # Skip if position is already occupied
            if pos in occupied_positions or self.is_obstacle_at(pos):
                continue
                
            # Ensure obstacles aren't placed near the center (starting area)
            center_x, center_y = GRID_WIDTH // 2, GRID_HEIGHT // 2
            distance_from_center = abs(pos[0] - center_x) + abs(pos[1] - center_y)
            if distance_from_center < 8:  # Minimum safe distance from center
                continue
                
            # Choose obstacle type based on weights
            obstacle_type = random.choices(obstacle_types, weights=obstacle_weights, k=1)[0]
            
            # Create and add obstacle
            obstacle = Obstacle(pos, obstacle_type)
            self.obstacles.append(obstacle)
    
    def is_obstacle_at(self, position):
        """Check if there's an obstacle at the given position."""
        for obstacle in self.obstacles:
            if obstacle.position == position:
                return True
        return False
        
    def draw(self, surface):
        """Draw all obstacles."""
        for obstacle in self.obstacles:
            obstacle.draw(surface)

class Food:
    # Define food types with their properties: (color, points, growth)
    FOOD_TYPES = {
        "regular": (RED, 1, 1),
        "golden": (GOLD, 3, 2),
        "super": (PURPLE, 5, 3),
        "special": (CYAN, 2, 2),
        "bonus": (HOT_PINK, 10, 4)
    }
    
    def __init__(self, food_type="regular"):
        self.position = (0, 0)
        self.type = food_type
        self.color, self.points, self.growth = self.FOOD_TYPES[food_type]
        self.randomize_position()
        
    def randomize_position(self):
        self.position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        
    def draw(self, surface):
        rect = pygame.Rect((self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(surface, self.color, rect)
        pygame.draw.rect(surface, BLACK, rect, 1)
        
class FoodManager:
    def __init__(self):
        self.foods = []
        self.min_food = 3
        self.max_food = 5
        self.food_type_weights = {
            "regular": 50,
            "golden": 20,
            "super": 10,
            "special": 15,
            "bonus": 5
        }
        self.initialize_food()
        
    def initialize_food(self):
        """Create initial food items."""
        count = random.randint(self.min_food, self.max_food)
        for _ in range(count):
            self.add_food()
    
    def add_food(self, avoid_positions=None):
        """Add a new food item to the game."""
        # Select food type based on weights
        food_type = random.choices(
            list(self.food_type_weights.keys()),
            weights=list(self.food_type_weights.values()),
            k=1
        )[0]
        
        new_food = Food(food_type)
        
        # Ensure food doesn't spawn on occupied positions
        if avoid_positions:
            while new_food.position in avoid_positions:
                new_food.randomize_position()
                
        self.foods.append(new_food)
        return new_food
    
    def remove_food(self, position):
        """Remove food at the specified position."""
        for i, food in enumerate(self.foods):
            if food.position == position:
                return self.foods.pop(i)
        return None
    
    def ensure_minimum_food(self, occupied_positions=None):
        """Ensure there's at least min_food items on the board."""
        while len(self.foods) < self.min_food:
            self.add_food(occupied_positions)
    
    def get_food_at_position(self, position):
        """Get the food at a specific position, if any."""
        for food in self.foods:
            if food.position == position:
                return food
        return None
    
    def draw(self, surface):
        """Draw all food items."""
        for food in self.foods:
            food.draw(surface)

class PowerUp:
    # Define power-up types with their properties: (color, duration, effect_name, description)
    POWERUP_TYPES = {
        "shield": (CYAN, 10, "shield", "Temporary invincibility"),
        "speed": (YELLOW, 8, "speed", "Increased movement speed"),
        "multiplier": (GOLD, 15, "multiplier", "Double score points")
    }
    
    def __init__(self, power_type="shield"):
        self.position = (0, 0)
        self.type = power_type
        self.color, self.duration, self.effect_name, self.description = self.POWERUP_TYPES[power_type]
        self.spawn_time = time.time()
        self.lifespan = 20  # Power-ups disappear after 20 seconds if not collected
        self.randomize_position()
        
    def randomize_position(self):
        self.position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        
    def is_expired(self):
        """Check if power-up has expired and should disappear."""
        return time.time() - self.spawn_time > self.lifespan
        
    def apply_effect(self, snake):
        """Apply power-up effect to the snake."""
        current_time = time.time()
        if self.type == "shield":
            snake.has_shield = True
            snake.shield_end_time = current_time + self.duration
        elif self.type == "speed":
            snake.speed_boost = 2  # Double the speed
            snake.speed_boost_end_time = current_time + self.duration
        elif self.type == "multiplier":
            snake.score_multiplier = 2  # Double the score points
            snake.score_multiplier_end_time = current_time + self.duration
            
    def draw(self, surface):
        rect = pygame.Rect((self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
        # Draw the powerup with pulsating effect to make it stand out
        pulse = int(math.sin(time.time() * 5) * 20 + 235)  # Value between 215-255
        
        # Get base color from self.color
        r, g, b = self.color
        
        # Create a new RGB tuple with properly clamped integer values
        pulse_color = (
            max(0, min(255, int(r + (pulse - 235)))),
            max(0, min(255, int(g + (pulse - 235)))),
            max(0, min(255, int(b + (pulse - 235))))
        )
        
        pygame.draw.rect(surface, pulse_color, rect)
        pygame.draw.rect(surface, BLACK, rect, 1)
        # Draw symbol to indicate power-up type
        if self.type == "shield":
            # Draw shield symbol (circle)
            center_x = self.position[0] * GRID_SIZE + GRID_SIZE // 2
            center_y = self.position[1] * GRID_SIZE + GRID_SIZE // 2
            pygame.draw.circle(surface, WHITE, (center_x, center_y), GRID_SIZE // 3, 1)
        elif self.type == "speed":
            # Draw speed symbol (lightning bolt)
            x = self.position[0] * GRID_SIZE
            y = self.position[1] * GRID_SIZE
            pygame.draw.polygon(surface, WHITE, [
                (x + 12, y + 5),
                (x + 8, y + 10),
                (x + 12, y + 10),
                (x + 8, y + 15)
            ], 1)
        elif self.type == "multiplier":
            # Draw multiplier symbol (x2)
            small_font = pygame.font.SysFont('Arial', 12)
            text_surface = small_font.render("x2", True, WHITE)
            text_rect = text_surface.get_rect(center=(
                self.position[0] * GRID_SIZE + GRID_SIZE // 2, 
                self.position[1] * GRID_SIZE + GRID_SIZE // 2
            ))
            surface.blit(text_surface, text_rect)

class PowerUpManager:
    def __init__(self):
        self.powerups = []
        self.spawn_probability = 0.01  # 1% chance per update to spawn a power-up
        self.max_powerups = 3  # Maximum simultaneous power-ups
        
    def update(self, occupied_positions):
        """Update power-ups: remove expired ones and possibly spawn new ones."""
        # Remove expired power-ups
        self.powerups = [p for p in self.powerups if not p.is_expired()]
        
        # Chance to spawn a new power-up if below max
        if len(self.powerups) < self.max_powerups and random.random() < self.spawn_probability:
            self.spawn_powerup(occupied_positions)
            
    def spawn_powerup(self, occupied_positions):
        """Spawn a new power-up at a random position."""
        # Choose power-up type
        powerup_types = list(PowerUp.POWERUP_TYPES.keys())
        weights = [10, 8, 5]  # Weights for shield, speed, multiplier
        
        powerup_type = random.choices(powerup_types, weights=weights, k=1)[0]
        new_powerup = PowerUp(powerup_type)
        
        # Ensure power-up doesn't spawn on occupied positions
        attempts = 0
        while (new_powerup.position in occupied_positions or 
               self.is_powerup_at(new_powerup.position)) and attempts < 20:
            new_powerup.randomize_position()
            attempts += 1
            
        if attempts < 20:  # Only add if we found a valid position
            self.powerups.append(new_powerup)
            
    def get_powerup_at(self, position):
        """Get power-up at the specified position, if any."""
        for powerup in self.powerups:
            if powerup.position == position:
                return powerup
        return None
        
    def remove_powerup(self, position):
        """Remove and return power-up at the specified position."""
        for i, powerup in enumerate(self.powerups):
            if powerup.position == position:
                return self.powerups.pop(i)
        return None
        
    def is_powerup_at(self, position):
        """Check if there's a power-up at the given position."""
        return self.get_powerup_at(position) is not None
        
    def draw(self, surface):
        """Draw all power-ups."""
        for powerup in self.powerups:
            powerup.draw(surface)

class TerrainManager:
    def __init__(self):
        self.terrain_map = {}  # Dictionary to store terrain type for each position
        self.patch_size_range = (3, 8)  # Min/max size for terrain patches
        self.initialize_terrain()
        
    def initialize_terrain(self):
        """Create initial terrain distribution."""
        # Start with all normal terrain
        for x in range(GRID_WIDTH):
            for y in range(GRID_HEIGHT):
                self.terrain_map[(x, y)] = "normal"
                
        # Create patches of special terrain types
        self._create_terrain_patches("ice", 2)
        self._create_terrain_patches("mud", 3)
        self._create_terrain_patches("sand", 2)
        
    def _create_terrain_patches(self, terrain_type, count):
        """Create patches of special terrain on the map."""
        for _ in range(count):
            # Choose a random center point for the terrain patch
            center_x = random.randint(0, GRID_WIDTH - 1)
            center_y = random.randint(0, GRID_HEIGHT - 1)
            
            # Random patch size between 3 and 7 cells
            patch_size = random.randint(3, 7)
            
            # Create a roughly circular patch of terrain
            for dx in range(-patch_size, patch_size + 1):
                for dy in range(-patch_size, patch_size + 1):
                    # Calculate distance from center (squared)
                    distance_squared = dx*dx + dy*dy
                    
                    # Only place terrain if within the circular radius
                    if distance_squared <= patch_size*patch_size:
                        # Calculate grid position
                        grid_x = (center_x + dx) % GRID_WIDTH
                        grid_y = (center_y + dy) % GRID_HEIGHT
                        
                        # Random chance to skip some cells for a more natural shape
                        if random.random() < 0.7:  # 70% chance to place terrain
                            self.terrain_map[(grid_x, grid_y)] = terrain_type
    
    def get_terrain_at(self, position):
        """Return the terrain type at the given position."""
        grid_pos = (position[0], position[1])
        return self.terrain_map.get(grid_pos, "normal")
    
    def draw(self, screen):
        """Draw all terrain patches on the screen."""
        for (grid_x, grid_y), terrain_type in self.terrain_map.items():
            rect = pygame.Rect(
                grid_x * GRID_SIZE,
                grid_y * GRID_SIZE,
                GRID_SIZE,
                GRID_SIZE
            )
            
            if terrain_type == "ice":
                # Light blue for ice
                color = (200, 240, 255)
                pygame.draw.rect(screen, color, rect)
                # Add shiny effect
                pygame.draw.line(screen, (255, 255, 255), 
                                (rect.left, rect.top), 
                                (rect.right, rect.bottom), 1)
            
            elif terrain_type == "mud":
                # Brown for mud
                color = (139, 69, 19)
                pygame.draw.rect(screen, color, rect)
                # Add texture effect
                for _ in range(3):
                    dot_x = rect.left + random.randint(2, GRID_SIZE - 2)
                    dot_y = rect.top + random.randint(2, GRID_SIZE - 2)
                    pygame.draw.circle(screen, (101, 67, 33), (dot_x, dot_y), 1)
            
            elif terrain_type == "sand":
                # Sand color
                color = (237, 201, 175)
                pygame.draw.rect(screen, color, rect)
                # Add texture effect
                for _ in range(5):
                    dot_x = rect.left + random.randint(2, GRID_SIZE - 2)
                    dot_y = rect.top + random.randint(2, GRID_SIZE - 2)
                    pygame.draw.circle(screen, (194, 178, 128), (dot_x, dot_y), 1)
class Game:
    def __init__(self):
        # Initialize pygame window
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption('Snake Game')
        
        # Initialize clock
        self.clock = pygame.time.Clock()
        
        # Initialize fonts
        self.font = pygame.font.SysFont('Arial', 36)
        self.score_font = pygame.font.SysFont('Arial', 14)
        
        # Initialize game state
        self.game_over = False
        
        # Initialize managers
        self.food_manager = FoodManager()
        self.powerup_manager = PowerUpManager()
        self.obstacle_manager = ObstacleManager()
        self.terrain_manager = TerrainManager()
        
        # Initialize game
        self.reset()
    
    def reset(self):
        # Create player snake
        self.player_snake = Snake(color=GREEN)
        
        # Create AI snakes with different strategies and starting positions
        self.ai_snakes = []
        
        # Add AI with "food" strategy
        food_ai = AISnake(
            strategy="food", 
            start_pos=(GRID_WIDTH // 4, GRID_HEIGHT // 4), 
            color=AI_COLORS[0]
        )
        self.ai_snakes.append(food_ai)
        
        # Add AI with "cautious" strategy
        cautious_ai = AISnake(
            strategy="cautious", 
            start_pos=(GRID_WIDTH // 4 * 3, GRID_HEIGHT // 4), 
            color=AI_COLORS[1]
        )
        self.ai_snakes.append(cautious_ai)
        
        # Add AI with "aggressive" strategy
        aggressive_ai = AISnake(
            strategy="aggressive", 
            start_pos=(GRID_WIDTH // 4, GRID_HEIGHT // 4 * 3), 
            color=AI_COLORS[2]
        )
        self.ai_snakes.append(aggressive_ai)
        
        # Add Zero IQ snake with random movement
        zero_iq_ai = ZeroIQSnake(
            start_pos=(GRID_WIDTH // 4 * 3, GRID_HEIGHT // 4 * 3),
        )
        self.ai_snakes.append(zero_iq_ai)
        
        # Add HunterSnake team that coordinates to eliminate other snakes
        # Create first hunter snake
        hunter1 = HunterSnake(
            start_pos=(GRID_WIDTH // 3, GRID_HEIGHT // 3),
            color=ORANGE,
            hunter_id=1
        )
        
        # Create second hunter snake
        hunter2 = HunterSnake(
            start_pos=(GRID_WIDTH // 3 * 2, GRID_HEIGHT // 3 * 2),
            color=LIME_GREEN,
            hunter_id=2
        )
        
        # Set each hunter as the partner of the other
        hunter1.set_partner(hunter2)
        hunter2.set_partner(hunter1)
        
        # Add hunter snakes to AI snakes list
        self.ai_snakes.append(hunter1)
        self.ai_snakes.append(hunter1)
        self.ai_snakes.append(hunter2)
        
        # Add Jinu F Jung - the talkative snake
        talkative_ai = TalkativeAISnake(
            start_pos=(GRID_WIDTH // 2, GRID_HEIGHT // 2 + 5),
            color=PINK
        )
        self.ai_snakes.append(talkative_ai)
        
        # All snakes list for easier iteration
        self.all_snakes = [self.player_snake] + self.ai_snakes
        
        # Reset managers
        self.food_manager = FoodManager()
        self.powerup_manager = PowerUpManager()
        
        # Initialize obstacles and avoid placing them on snakes
        occupied_positions = []
        for snake in self.all_snakes:
            occupied_positions.extend(snake.positions)
        
        self.obstacle_manager = ObstacleManager()
        self.obstacle_manager.initialize_obstacles(occupied_positions)
        
        # Terrain is already initialized during TerrainManager creation
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if self.game_over:
                    if event.key == pygame.K_r:
                        self.reset()
                        self.game_over = False
                else:
                    if event.key == pygame.K_UP:
                        self.player_snake.change_direction(UP)
                    elif event.key == pygame.K_DOWN:
                        self.player_snake.change_direction(DOWN)
                    elif event.key == pygame.K_LEFT:
                        self.player_snake.change_direction(LEFT)
                    elif event.key == pygame.K_RIGHT:
                        self.player_snake.change_direction(RIGHT)
    
    def update(self):
        if self.game_over:
            return
            
        # Get all snake positions for collision detection
        all_snake_positions = [snake.positions for snake in self.all_snakes if snake.alive]
        
        # Get all occupied positions for power-up and food management
        occupied_positions = []
        for snake in self.all_snakes:
            if snake.alive:
                occupied_positions.extend(snake.positions)
        
        # Add obstacle positions to occupied positions
        for obstacle in self.obstacle_manager.obstacles:
            occupied_positions.append(obstacle.position)
        
        # Update power-ups (remove expired ones, possibly spawn new ones)
        self.powerup_manager.update(occupied_positions)
        
        # Move the player snake first
        if self.player_snake.alive:
            # Move player snake and check for collisions with all other snakes and terrain
            game_continues = self.player_snake.move(all_snake_positions, self.terrain_manager, self.obstacle_manager)
            
            # Check if player snake ate any food
            head_position = self.player_snake.get_head_position()
            food = self.food_manager.get_food_at_position(head_position)
            if food:
                # Grow snake and increase score based on food type
                self.player_snake.grow(food.growth, food.points)
                
                # Remove the eaten food
                self.food_manager.remove_food(head_position)
            
            # Check if player snake got a power-up
            powerup = self.powerup_manager.get_powerup_at(head_position)
            if powerup:
                # Apply power-up effect to the snake
                powerup.apply_effect(self.player_snake)
                
                # Remove the collected power-up
                self.powerup_manager.remove_powerup(head_position)
            
            # Check if player snake is still alive
            if not game_continues:
                self.player_snake.alive = False
        
        # Move all AI snakes
        for ai_snake in self.ai_snakes:
            if ai_snake.alive:
                # Let AI decide next move
                ai_snake.think(self.food_manager, self.all_snakes)
                
                # Move AI snake and check for collisions
                # Move AI snake and check for collisions
                ai_continues = ai_snake.move(all_snake_positions, self.terrain_manager, self.obstacle_manager)
                # Check if AI snake ate any food
                head_position = ai_snake.get_head_position()
                food = self.food_manager.get_food_at_position(head_position)
                if food:
                    # Grow snake and increase score based on food type
                    ai_snake.grow(food.growth, food.points)
                    
                    
                    # Remove the eaten food
                    self.food_manager.remove_food(head_position)
                
                # Check if AI snake got a power-up
                powerup = self.powerup_manager.get_powerup_at(head_position)
                if powerup:
                    # Apply power-up effect to the snake
                    powerup.apply_effect(ai_snake)
                    
                    # Remove the collected power-up
                    self.powerup_manager.remove_powerup(head_position)
                    
                # Check if AI snake is still alive
                    ai_snake.alive = False
        
        # Gather all occupied positions to avoid spawning food on snakes
        occupied_positions = []
        for snake in self.all_snakes:
            if snake.alive:
                occupied_positions.extend(snake.positions)
                
        # Ensure minimum number of food items on the board
        self.food_manager.ensure_minimum_food(occupied_positions)
        
        # Check if game is over (player snake is dead)
        if not self.player_snake.alive:
            self.game_over = True
            
        # Check if all AI snakes are dead
        if all(not ai.alive for ai in self.ai_snakes):
            # If only the player is left, keep going
            if self.player_snake.alive:
                pass
            else:
                self.game_over = True
    
    def draw(self):
        self.screen.fill(BLACK)
        
        # Draw terrain
        self.terrain_manager.draw(self.screen)
        
        # Draw grid
        for x in range(0, WIDTH, GRID_SIZE):
            pygame.draw.line(self.screen, WHITE, (x, 0), (x, HEIGHT), 1)
        for y in range(0, HEIGHT, GRID_SIZE):
            pygame.draw.line(self.screen, WHITE, (0, y), (WIDTH, y), 1)
        
        # Draw obstacles
        self.obstacle_manager.draw(self.screen)
            
        # Draw all food particles
        self.food_manager.draw(self.screen)
        
        # Draw all power-ups
        self.powerup_manager.draw(self.screen)
        
        # Draw all snakes
        for snake in self.all_snakes:
            snake.draw(self.screen)
            
            # Draw speech bubble for AI snakes
            if isinstance(snake, AISnake) and snake.alive and hasattr(snake, 'current_saying'):
                # Get all nearby snake heads to check for crowding
                nearby_heads = []
                for other_snake in self.ai_snakes:
                    if other_snake.alive and other_snake != snake:
                        other_head = other_snake.get_head_position()
                        this_head = snake.get_head_position()
                        # Calculate distance between heads
                        distance = abs(this_head[0] - other_head[0]) + abs(this_head[1] - other_head[1])
                        if distance < 5:  # Consider snakes within 5 cells as "nearby"
                            nearby_heads.append(other_head)
                
                # Reduce probability of showing bubble based on nearby snakes
                # The more nearby snakes, the less likely to show a bubble
                show_bubble_chance = 1.0 / (1 + 0.5 * len(nearby_heads))
                
                if random.random() < show_bubble_chance:
                    # Get head position
                    head_pos = snake.get_head_position()
                    head_x = head_pos[0] * GRID_SIZE
                    head_y = head_pos[1] * GRID_SIZE
                    
                    # Add small random offset to prevent bubbles from stacking
                    offset_x = random.randint(-10, 10)
                    offset_y = random.randint(-5, 5)
                    
                    # Render saying text
                    text_surface = self.score_font.render(snake.current_saying, True, WHITE)
                    text_rect = text_surface.get_rect()
                    
                    # Position text above snake's head with offset
                    text_rect.centerx = head_x + GRID_SIZE // 2 + offset_x
                    text_rect.bottom = head_y - 10 + offset_y
                    
                    # Draw background for the text
                    padding = 5
                    bubble_rect = pygame.Rect(
                        text_rect.left - padding, 
                        text_rect.top - padding,
                        text_rect.width + padding * 2, 
                        text_rect.height + padding * 2
                    )
                    pygame.draw.rect(self.screen, BLACK, bubble_rect)
                    pygame.draw.rect(self.screen, snake.color, bubble_rect, 2)
                    
                    # Draw the text
                    self.screen.blit(text_surface, text_rect)
        
        # Draw scoreboard
        self.draw_scoreboard()
        
        # Game over message
        if self.game_over:
            game_over_text = self.font.render('Game Over! Press R to Restart', True, WHITE)
            text_rect = game_over_text.get_rect(center=(WIDTH//2, HEIGHT//2))
            self.screen.blit(game_over_text, text_rect)
            
            # Draw winner announcement
            living_snakes = [s for s in self.all_snakes if s.alive]
            if living_snakes:
                # Find the snake with highest score among living snakes
                winner = max(living_snakes, key=lambda s: s.score)
                if winner.is_player:
                    winner_text = "You win!"
                else:
                    winner_text = f"{winner.name} wins!"
                win_text = self.font.render(winner_text, True, winner.color)
                win_rect = win_text.get_rect(center=(WIDTH//2, HEIGHT//2 + 40))
                self.screen.blit(win_text, win_rect)
            else:
                # If all snakes are dead, winner is the one with highest score
                winner = max(self.all_snakes, key=lambda s: s.score)
                if winner.is_player:
                    winner_text = "You had the highest score!"
                else:
                    winner_text = f"{winner.name} had the highest score!"
                win_text = self.font.render(winner_text, True, winner.color)
                win_rect = win_text.get_rect(center=(WIDTH//2, HEIGHT//2 + 40))
                self.screen.blit(win_text, win_rect)
            
        pygame.display.update()
    
    def draw_scoreboard(self):
        # Create semi-transparent surface for the scoreboard
        scoreboard_width = 180
        scoreboard_height = 20 * (len(self.all_snakes) + 1)  # +1 for the header
        
        # Position scoreboard on right side
        scoreboard_x = WIDTH - scoreboard_width - 5
        scoreboard_y = 5
        
        # Create a transparent surface
        scoreboard_surface = pygame.Surface((scoreboard_width, scoreboard_height))
        scoreboard_surface.set_alpha(180)  # Set transparency (0-255)
        scoreboard_surface.fill((0, 0, 0))  # Fill with black
        
        # Create rectangle for border
        scoreboard_rect = pygame.Rect(scoreboard_x, scoreboard_y, scoreboard_width, scoreboard_height)
        
        # Draw the semi-transparent surface and border
        self.screen.blit(scoreboard_surface, (scoreboard_x, scoreboard_y))
        pygame.draw.rect(self.screen, WHITE, scoreboard_rect, 1)
        
        # Draw header
        header_text = self.score_font.render("SCOREBOARD", True, WHITE)
        self.screen.blit(header_text, (scoreboard_x + 5, scoreboard_y + 5))
        
        # Create food legend panel below the scoreboard
        legend_width = scoreboard_width
        legend_height = 20 * (len(Food.FOOD_TYPES) + 1)  # +1 for header
        
        legend_x = scoreboard_x
        legend_y = scoreboard_y + scoreboard_height + 10
        
        # Create transparent surface for legend
        legend_surface = pygame.Surface((legend_width, legend_height))
        legend_surface.set_alpha(180)  # Set transparency (0-255)
        legend_surface.fill((0, 0, 0))  # Fill with black
        
        # Create rectangle for border
        legend_rect = pygame.Rect(legend_x, legend_y, legend_width, legend_height)
        
        # Only show food legend if there's space at bottom of screen
        if legend_y + legend_height < HEIGHT - 20:
            # Draw the semi-transparent surface and border
            self.screen.blit(legend_surface, (legend_x, legend_y))
            pygame.draw.rect(self.screen, WHITE, legend_rect, 1)
            
            # Draw legend header
            legend_text = self.score_font.render("FOOD LEGEND", True, WHITE)
            self.screen.blit(legend_text, (legend_x + 5, legend_y + 5))
            
            # Display each food type with its color, points, and growth value
            for i, (food_type, (color, points, growth)) in enumerate(Food.FOOD_TYPES.items()):
                food_y = legend_y + 25 + i * 16  # More compact spacing
                
                # Draw food color square
                food_rect = pygame.Rect(legend_x + 10, food_y, GRID_SIZE - 2, GRID_SIZE - 2)
                pygame.draw.rect(self.screen, color, food_rect)
                pygame.draw.rect(self.screen, BLACK, food_rect, 1)
                
                # Display food information (shorter text to save space)
                food_info = f"{food_type.capitalize()}: {points}pts/+{growth}"
                food_text = self.score_font.render(food_info, True, WHITE)
                self.screen.blit(food_text, (legend_x + 30, food_y))
        
        
        # Sort snakes by score
        sorted_snakes = sorted(self.all_snakes, key=lambda s: s.score, reverse=True)
        
        # Draw scores for each snake
        scoreboard_x = WIDTH - scoreboard_width - 5  # Re-use x position
        for i, snake in enumerate(sorted_snakes):
            y_pos = scoreboard_y + 25 + i * 16  # More compact spacing
            name = "You" if snake.is_player else snake.name
            status = "ALIVE" if snake.alive else "DEAD"
            score_text = self.score_font.render(f"{name}: {snake.score} ({status})", True, snake.color)
            self.screen.blit(score_text, (scoreboard_x + 5, y_pos))
    
    def run(self):
        while True:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)

# Main function
def main():
    game = Game()
    game.run()

if __name__ == "__main__":
    main()
