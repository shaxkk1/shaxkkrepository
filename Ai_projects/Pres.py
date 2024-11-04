import random
from collections import Counter

# Card Class
class Card:
    """Represents a playing card."""
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __str__(self):
        return f"{self.rank} of {self.suit}"

# Deck Class
class Deck:
    """Represents a deck of cards."""
    def __init__(self):
        self.cards = [Card(rank, suit) for suit in ["Hearts", "Diamonds", "Clubs", "Spades"]
                      for rank in range(1, 14)]  # 1 is Ace, 2-10, 11 is Jack, 12 is Queen, 13 is King
        random.shuffle(self.cards)

    def draw_card(self):
        """Draw a card from the deck."""
        return self.cards.pop() if self.cards else None

# Player Class
class Player:
    """Represents a player in the game."""
    def __init__(self, name):
        self.name = name
        self.hand = []

    def draw(self, deck):
        """Draw a card from the deck."""
        card = deck.draw_card()
        if card:
            self.hand.append(card)

    def play_cards(self, cards):
        """Play a set of cards from hand."""
        for card in cards:
            self.hand.remove(card)
        return cards

    def show_hand(self):
        """Show the player's hand."""
        return [str(card) for card in self.hand]

    def is_out_of_cards(self):
        """Check if player is out of cards."""
        return len(self.hand) == 0

class Game:
    """Represents the Pres game."""
    def __init__(self, player_names):
        self.players = [Player(name) for name in player_names]
        self.deck = Deck()
        self.trick = []
        self.current_player_index = 0

    def deal_cards(self):
        """Deal cards to all players."""
        while self.deck.cards:
            for player in self.players:
                player.draw(self.deck)

    def next_player(self):
        """Move to the next player in turn."""
        self.current_player_index = (self.current_player_index + 1) % len(self.players)

    def valid_play(self, played_cards):
        """Check if the play is valid."""
        if not played_cards:
            return False
        rank_counts = Counter(card.rank for card in played_cards)
        return len(rank_counts) == 1  # All cards must be of the same rank

    def play_round(self):
        """Play a round of the game."""
        if all(player.is_out_of_cards() for player in self.players):
            print("All players are out of cards!")
            return

        current_player = self.players[self.current_player_index]
        print(f"\n{current_player.name}'s turn.")
        print("Your hand:", current_player.show_hand())
        print("Previous play:", [str(card) for card in self.trick] if self.trick else "None")

        # Get player's input
        player_input = input("Enter cards to play (e.g., '2 2 2' for three 2s) or 'pass': ").strip()
        if player_input.lower() == 'pass':
            print(f"{current_player.name} passed.")
            self.next_player()
            return

        # Parse input
        try:
            ranks = list(map(int, player_input.split()))
            played_cards = [card for card in current_player.hand if card.rank in ranks]

            if not self.valid_play(played_cards):
                print("Invalid play! You must play cards of the same rank.")
                self.next_player()
                return

            # Determine if the played cards beat the previous play
            if self.trick:
                last_played_rank = max(card.rank for card in self.trick)
                if max(card.rank for card in played_cards) <= last_played_rank:
                    print("You must play a higher card or set of cards!")
                    self.next_player()
                    return

            # Play the cards
            current_player.play_cards(played_cards)
            self.trick = played_cards  # Set the trick to the current play
            print(f"{current_player.name} played: {', '.join(map(str, played_cards))}")

            # Check for players out of cards
            if current_player.is_out_of_cards():
                print(f"{current_player.name} is out of cards!")

        except ValueError:
            print("Invalid input! Please enter valid card ranks or 'pass'.")

        # Move to the next player
        self.next_player()

    def start_game(self):
        """Start the game."""
        self.deal_cards()
        while True:
            self.play_round()
            if all(player.is_out_of_cards() for player in self.players):
                break

        # Determine the ranks
        president = next(player for player in self.players if player.is_out_of_cards())
        scum = next(player for player in self.players if not player.is_out_of_cards())

        print(f"\n{president.name} is the President!")
        print(f"{scum.name} is the Scum!")

# Main function to run the game
if __name__ == "__main__":
    player_count = int(input("Enter number of players (2-6): "))
    if 2 <= player_count <= 6:
        player_names = [input(f"Enter name for Player {i + 1}: ") for i in range(player_count)]
        game = Game(player_names)
        game.start_game()
    else:
        print("Invalid number of players. Please enter a number between 2 and 6.")
