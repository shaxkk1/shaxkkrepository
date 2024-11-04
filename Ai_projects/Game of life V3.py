import time
import random

# Function to slow down the printing for a more engaging experience
def slow_print(text, delay=0.05):
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

# Life stages with choices, consequences, and events
stages = {
    "infant": {
        "description": "You are an infant, discovering the world. Do you want to cry, sleep, or play?",
        "choices": {
            "cry": {"consequence": "good", "health": 5, "text": "Your parents comfort you and feed you."},
            "sleep": {"consequence": "neutral", "health": 2, "text": "You sleep peacefully and grow strong."},
            "play": {"consequence": "bad", "health": -5, "text": "You play alone and get a cold."}
        },
        "next_stage": "child"
    },
    "child": {
        "description": "You are now a child. Do you want to play with other kids, read books, or explore the outdoors?",
        "choices": {
            "play": {"consequence": "good", "health": 5, "money": 0, "text": "You make friends and learn social skills."},
            "read": {"consequence": "neutral", "health": 0, "money": 5, "text": "You become smarter, and you learn a lot."},
            "explore": {"consequence": "bad", "health": -10, "text": "You get lost and hurt while exploring."}
        },
        "next_stage": "teenager"
    },
    "teenager": {
        "description": "You are a teenager. Life gets harder. Do you focus on school, spend time with friends, or take risks?",
        "choices": {
            "school": {"consequence": "good", "health": 0, "money": 10, "text": "You get good grades, setting yourself up for success."},
            "friends": {"consequence": "neutral", "health": 0, "money": 0, "text": "You have fun, but nothing really changes."},
            "risks": {"consequence": "bad", "health": -20, "money": -10, "text": "You make bad decisions and your health suffers."}
        },
        "next_stage": "young_adult"
    },
    "young_adult": {
        "description": "You are a young adult. Do you go to college, start working, or travel the world?",
        "choices": {
            "college": {"consequence": "good", "health": 0, "money": -30, "text": "You gain a valuable education but take on debt."},
            "work": {"consequence": "neutral", "health": 5, "money": 20, "text": "You start working, making a steady income."},
            "travel": {"consequence": "bad", "health": 10, "money": -50, "text": "You enjoy traveling, but you deplete your savings."}
        },
        "next_stage": "adult"
    },
    "adult": {
        "description": "You are an adult. Do you focus on career, family, or health?",
        "choices": {
            "career": {"consequence": "good", "health": -10, "money": 50, "text": "You advance in your career, but you feel stressed."},
            "family": {"consequence": "neutral", "health": 10, "money": -10, "text": "You spend time with family, balancing work and life."},
            "health": {"consequence": "good", "health": 20, "money": -20, "text": "You prioritize your health, but work suffers."}
        },
        "next_stage": "old_age"
    },
    "old_age": {
        "description": "You are now in the twilight years of your life. Do you retire, work on passion projects, or live with family?",
        "choices": {
            "retire": {"consequence": "neutral", "health": 10, "money": -30, "text": "You enjoy retirement but have less income."},
            "projects": {"consequence": "good", "health": -5, "money": 30, "text": "You work on personal projects, but it's stressful."},
            "family": {"consequence": "good", "health": 20, "money": -10, "text": "You live with family, finding comfort in loved ones."}
        },
        "next_stage": None  # End of the game
    }
}

# Life consequence impact on score and health
score_modifiers = {
    "good": 10,
    "neutral": 0,
    "bad": -10
}

# Function to play each stage of life
def play_stage(stage_name, score, health, money):
    stage = stages[stage_name]
    slow_print(stage["description"])
    
    # Show choices
    for option in stage["choices"]:
        print(f"- {option.capitalize()}")

    choice = input("Your choice: ").lower()

    # Validate the choice
    if choice in stage["choices"]:
        result = stage["choices"][choice]
        consequence = result["consequence"]

        # Modify score, health, and money based on choice
        score += score_modifiers[consequence]
        health += result.get("health", 0)
        money += result.get("money", 0)

        slow_print(result["text"])

        # Check if the player has died
        if health <= 0:
            slow_print("Your health has deteriorated, and unfortunately, you have passed away.")
            return score, health, money, True  # End the game if dead

        # Random event could slightly affect health, money, or score
        random_event = random.choice(["health", "money", "none"])
        if random_event == "health":
            health_change = random.randint(-5, 10)
            health += health_change
            if health_change > 0:
                slow_print(f"A health boost occurs! You feel stronger (+{health_change} health).")
            else:
                slow_print(f"An illness strikes! You lose {-health_change} health.")

        elif random_event == "money":
            money_change = random.randint(-20, 20)
            money += money_change
            if money_change > 0:
                slow_print(f"A financial windfall! You gain ${money_change}.")
            else:
                slow_print(f"A financial loss! You lose ${-money_change}.")

    else:
        slow_print("That's not a valid choice. Please try again.")
        return play_stage(stage_name, score, health, money)  # Retry if invalid choice

    # Move to the next stage if available
    next_stage = stage["next_stage"]
    if next_stage:
        slow_print("\nMoving to the next stage of life...\n")
        return play_stage(next_stage, score, health, money)
    else:
        return score, health, money, False

# Function to summarize life and give a final outcome
def life_summary(score, health, money):
    slow_print(f"\nYour final life score is: {score}")
    slow_print(f"Your final health: {health}")
    slow_print(f"Your final money: ${money}")

    if health <= 0:
        slow_print("You didn't make it to the end of life. Rest in peace.")
    elif score > 50 and money > 0 and health > 0:
        slow_print("You lived an incredibly successful life, filled with accomplishments and balance!")
    elif score > 30:
        slow_print("You lived a balanced life, with both ups and downs but ultimately found satisfaction.")
    elif score > 0:
        slow_print("Life was challenging, but you managed to get through it.")
    else:
        slow_print("Life was tough, and it didn't go as you hoped. But you did your best.")
    slow_print("Thank you for playing the Game of Life!")

# Main function to start the game
def start_game():
    slow_print("Welcome to the Enhanced Game of Life! Your choices will shape your journey.\n")
    input("Press Enter to start your life journey...\n")
    
    # Initial health, money, and score
    score = 0
    health = 50
    money = 0

    final_score, final_health, final_money, is_dead = play_stage("infant", score, health, money)
    
    # If the player died, give a final summary
    if is_dead:
        slow_print(f"\nYou have passed away with a score of {final_score}, ${final_money} in your account, and {final_health} health.")
        slow_print("You didn't make it to the end of life. Rest in peace.")
    else:
        life_summary(final_score, final_health, final_money)
        
# Start the game
if __name__ == "__main__":
    start_game()

