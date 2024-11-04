import time

# Function to slow down the printing for a more engaging experience
def slow_print(text, delay=0.05):
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

# Life stages options and results
stages = {
    "infant": {
        "description": "You are an infant, discovering the world around you. Do you want to cry or sleep?",
        "choices": {
            "cry": "You cry loudly, and your parents come running to comfort you. You feel loved.",
            "sleep": "You sleep peacefully, dreaming about the world you’ll soon explore."
        },
        "next_stage": "child"
    },
    "child": {
        "description": "You are a child now. Do you want to play with toys or read books?",
        "choices": {
            "play": "You play with toys, using your imagination to create wonderful stories.",
            "read": "You read fascinating books, learning about the world and sparking curiosity."
        },
        "next_stage": "teenager"
    },
    "teenager": {
        "description": "You are a teenager. High school life is challenging. Do you want to focus on studying or hang out with friends?",
        "choices": {
            "study": "You focus on your studies, preparing for a bright future ahead.",
            "friends": "You spend time with friends, creating unforgettable memories but struggling with balancing schoolwork."
        },
        "next_stage": "adult"
    },
    "adult": {
        "description": "You are now an adult. It's time to make major life decisions. Do you want to pursue a career or travel the world?",
        "choices": {
            "career": "You build a successful career, gaining stability and satisfaction in your work.",
            "travel": "You travel the world, experiencing new cultures and learning valuable life lessons."
        },
        "next_stage": "old_age"
    },
    "old_age": {
        "description": "You are now in the later stages of life. Do you want to retire peacefully or spend time with family?",
        "choices": {
            "retire": "You retire peacefully, reflecting on the long and fulfilling life you've lived.",
            "family": "You spend your remaining years with family, passing on wisdom and enjoying their company."
        },
        "next_stage": None  # End of the game
    }
}

# Function to play each stage of life
def play_stage(stage_name):
    stage = stages[stage_name]
    slow_print(stage["description"])

    # Show choices
    for option, result in stage["choices"].items():
        print(f"- {option.capitalize()}")

    choice = input("Your choice: ").lower()

    # Validate the choice
    if choice in stage["choices"]:
        slow_print(stage["choices"][choice])
    else:
        slow_print("That's not a valid choice. Please try again.")
        return play_stage(stage_name)  # Retry if invalid choice

    # Move to the next stage if available
    next_stage = stage["next_stage"]
    if next_stage:
        slow_print("\nMoving to the next stage of life...\n")
        play_stage(next_stage)
    else:
        slow_print("You have lived a full life. The journey ends here. Thank you for playing!")

# Main function to start the game
def start_game():
    slow_print("Welcome to the Game of Life!\n")
    input("Press Enter to start your life journey...\n")
    play_stage("infant")

# Start the game
if __name__ == "__main__":
    start_game()
