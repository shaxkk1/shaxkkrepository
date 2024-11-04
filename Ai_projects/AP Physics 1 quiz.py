# Questions for the quiz
questions = [
    {
        "question": "1. What is Newton's First Law of Motion?",
        "choices": {
            "a": "An object will remain at rest or in uniform motion unless acted on by an external force.",
            "b": "The acceleration of an object is proportional to the net force and inversely proportional to its mass.",
            "c": "For every action, there is an equal and opposite reaction.",
            "d": "The force of gravity is proportional to the product of two masses."
        },
        "answer": "a"
    },
    {
        "question": "2. What is the unit of force in the SI system?",
        "choices": {
            "a": "Joule",
            "b": "Newton",
            "c": "Watt",
            "d": "Pascal"
        },
        "answer": "b"
    },
    {
        "question": "3. Which of the following quantities is a scalar?",
        "choices": {
            "a": "Velocity",
            "b": "Displacement",
            "c": "Force",
            "d": "Speed"
        },
        "answer": "d"
    },
    {
        "question": "4. What is the formula for kinetic energy?",
        "choices": {
            "a": "KE = 1/2 mv^2",
            "b": "KE = mv",
            "c": "KE = ma",
            "d": "KE = mgh"
        },
        "answer": "a"
    },
    {
        "question": "5. What is the acceleration due to gravity near the Earth's surface?",
        "choices": {
            "a": "9.8 m/s²",
            "b": "9.8 m/s",
            "c": "9.8 N/kg",
            "d": "9.8 kg/m²"
        },
        "answer": "a"
    },
    {
        "question": "6. In a perfectly inelastic collision, which of the following is true?",
        "choices": {
            "a": "Momentum is not conserved.",
            "b": "Kinetic energy is conserved.",
            "c": "The objects stick together after collision.",
            "d": "The total energy is lost."
        },
        "answer": "c"
    },
    {
        "question": "7. A 2 kg object moves at 3 m/s. What is its momentum?",
        "choices": {
            "a": "6 kg·m/s",
            "b": "9 kg·m/s",
            "c": "3 kg·m/s",
            "d": "12 kg·m/s"
        },
        "answer": "a"
    },
    {
        "question": "8. Which of the following describes the centripetal force?",
        "choices": {
            "a": "It is directed perpendicular to the object's velocity.",
            "b": "It is directed outward from the center of the object's circular path.",
            "c": "It is directed toward the center of the object's circular path.",
            "d": "It depends on the object's displacement."
        },
        "answer": "c"
    }
]

# Function to conduct the quiz
def conduct_quiz():
    score = 0
    total_questions = len(questions)

    # Loop through each question
    for q in questions:
        print(q["question"])
        for option, choice in q["choices"].items():
            print(f"{option}. {choice}")
        answer = input("Your answer (a/b/c/d): ").lower()

        # Check if the answer is correct
        if answer == q["answer"]:
            print("Correct!\n")
            score += 1
        else:
            print(f"Wrong! The correct answer is {q['answer']}.\n")

    # Display the final score
    print(f"Quiz complete! Your final score is {score} out of {total_questions}.")

# Run the quiz
if __name__ == "__main__":
    print("Welcome to the AP Physics 1 Quiz!")
    input("Press Enter to start...\n")
    conduct_quiz()
    print("Thank you for participating!")
