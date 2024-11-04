import time
import random

# Function to slow down the printing for a more engaging experience
def slow_print(text, delay=0.05):
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

# Life stages with choices and consequences
stages = {
    "infant": {
        "description": "You are an infant, discovering the world around you. Do you want to cry or sleep?",
        "choices": {
            "cry": {"consequence": "good", "text": "Your parents comfort you and bond with you."},
            "sleep": {"consequence": "bad", "text": "You sleep too much, missing some early social development."}
        },
        "next_stage": "child"
    },
    "child": {
        "description": "You are a child now. Do you want to play with other kids or spend time alone?",
        "choices": {
            "play": {"consequence": "good", "text": "You make friends, learning social skills."},
            "alone": {"consequence": "bad", "text": "You feel lonely and miss opportunities to build friendships."}
        },
        "next_stage": "teenager"
    },
    "teenager": {
        "description": "You are a teenager. High school can be tough. Do you focus on schoolwork or hang out with friends?",
        "choices": {
            "school": {"consequence": "good", "text": "You excel academically, preparing for a bright future."},
            "friends": {"consequence": "bad", "text": "You have fun with friends, but your grades suffer."}
        },
        "next_stage": "young_adult"
    },
    "young_adult": {
        "description": "You are a young adult now. Do you want to go to college or start working right away?",
        "choices": {
            "college": {"consequence": "good", "text": "You gain valuable education and qualifications."},
            "work": {"consequence": "bad", "text": "You start working but struggle to advance without higher education."}
        },
        "next_stage": "adult"
    },
    "adult": {
        "description": "You are an adult now. Do you want to focus on your career or start a family?",
        "choices": {
            "career": {"consequence": "good", "text": "You build a successful career, becoming financially stable."},
            "family": {"consequence": "bad", "text": "You focus on family but find it hard to balance work and personal life."}
        },
        "next_stage": "old_age"
    },
    "old_age": {
        "description": "You are now in the later stages of life. Do you retire and relax or work on passion projects?",
        "choices": {
            "retire": {"consequence": "good", "text": "You enjoy a peaceful retirement, reflecting on a fulfilling life."},
            "passion": {"consequence": "bad", "text": "You work hard on passion projects but stress affects your health."}
        },
        "next_stage": None  # End of the game
    }
}

# Life consequence impact on final score
score_modifiers = {
    "good": 10,
    "bad": -5
}

# Function to play each stage of life
def play_stage(stage_name, score):
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
        slow_print(result["text"])

        # Modify score based on consequence
        score += score_modifiers[consequence]

        # Random event could slightly affect the score
        random_event = random.choice(["good", "bad"])
        if random_event == "good":
            slow_print("A fortunate event occurs, giving you a bit of luck in life!")
            score += 5
        elif random_event == "bad":
            slow_print("An unexpected challenge arises, setting you back a bit in life.")
            score -= 5

    else:
        slow_print("That's not a valid choice. Please try again.")
        return play_stage(stage_name, score)  # Retry if invalid choice

    # Move to the next stage if available
    next_stage = stage["next_stage"]
    if next_stage:
        slow_print("\nMoving to the next stage of life...\n")
        return play_stage(next_stage, score)
    else:
        return score

# Function to calculate final score and give feedback
def life_summary(score):
    slow_print(f"\nYour final life score is: {score}")
    
    if score > 40:
        slow_print("You have lived an extraordinarily successful life. You achieved great things and found happiness.")
    elif score > 20:
        slow_print("You lived a good life, with a healthy balance of achievements and happiness.")
    elif score > 0:
        slow_print("Your life had its ups and downs, but overall, you managed to navigate through challenges.")
    else:
        slow_print("Life was tough, and despite your best efforts, the road was full of obstacles.")
    slow_print("Thank you for playing the Game of Life!")

# Main function to start the game
def start_game():
    slow_print("Welcome to the Game of Life! Your choices will shape your journey from infancy to old age.\n")
    input("Press Enter to start your life journey...\n")
    final_score = play_stage("infant", 0)
    life_summary(final_score)

# Start the game
if __name__ == "__main__":
    start_game()
