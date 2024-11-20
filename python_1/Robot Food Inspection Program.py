# Robot Food Inspection Program

# Function to simulate the robot going to the kitchen
def robot_go_to_kitchen():
    """
    Simulates the robot going to the kitchen.
    """
    print("Robot is going to the kitchen to inspect the food...")

# Function to simulate grabbing food from the pan
def grab_food_from_pan(food_item):
    """
    Simulates the robot grabbing food from the pan.
    
    Parameters:
    food_item (str): The food item being grabbed (e.g., steak, chicken, pasta).
    """
    print(f"Robot grabs the {food_item} from the pan.")

# Function to inspect the food's state
def inspect_food(food_item):
    """
    Prompts the user to input the current state of the food.
    
    Parameters:
    food_item (str): The food item being inspected.
    
    Returns:
    str: The state of the food (undercooked, cooked, or overcooked).
    """
    # Ask the user to input the food's state
    food_state = input(f"Enter the state of the {food_item} (undercooked, cooked, overcooked): ").lower()
    
    # Validate the input
    while food_state not in ["undercooked", "cooked", "overcooked"]:
        print("Invalid input. Please enter 'undercooked', 'cooked', or 'overcooked'.")
        food_state = input(f"Enter the state of the {food_item} (undercooked, cooked, overcooked): ").lower()
    
    print(f"Inspecting {food_item}... It is {food_state}.")
    return food_state

# Function to simulate the chef cooking the food more
def chef_cook_more():
    """
    Simulates the chef cooking the food more.
    """
    print("Chef is cooking the food more...")

# Function to throw away the food if it's overcooked
def throw_away_food(food_item):
    """
    Simulates throwing the food away if it is overcooked.
    
    Parameters:
    food_item (str): The food item being thrown away.
    """
    print(f"The {food_item} is overcooked. Throwing it away.")

# Function to serve the food to guests if it's cooked well
def serve_food_to_guests(food_item):
    """
    Simulates serving the food to the guests if it is cooked well.
    
    Parameters:
    food_item (str): The food item being served.
    """
    print(f"The {food_item} is cooked well. Serving it to the guests.")

# Main function to simulate the robot's food inspection process
def main():
    """
    Main function that runs the robot's food inspection and decision-making process.
    """
    # List of food items to inspect
    food_items = ["steak", "chicken", "pasta"]
    
    # Robot goes to the kitchen
    robot_go_to_kitchen()

    # Loop through the list of food items
    for food_item in food_items:
        print(f"\nInspecting {food_item}...")

        # Grab the food from the pan
        grab_food_from_pan(food_item)

        # Inspect the food by getting input from the user
        food_state = inspect_food(food_item)

        # While the food is undercooked, make the chef cook more
        while food_state == "undercooked":
            chef_cook_more()
            # Ask the user again to inspect the food after cooking more
            food_state = inspect_food(food_item)

        # If the food is overcooked, throw it away
        if food_state == "overcooked":
            throw_away_food(food_item)

        # If the food is cooked well, serve it to the guests
        elif food_state == "cooked":
            serve_food_to_guests(food_item)

# Run the program
main()

"""
Changes:
Specify Food Item:
The function inspect_food() now takes the food_item as an argument and includes it in the prompt to specify which food is being inspected. This allows the user to specify the state of a particular food item, such as "steak", "chicken", or "pasta".
The same is true for the functions grab_food_from_pan(), throw_away_food(), and serve_food_to_guests()—they all now take the food_item parameter to make the process more descriptive.
Interactive Input:
The program asks the user to enter the state of the food for each item in the list (e.g., steak, chicken, pasta). The input is validated to ensure that it’s either "undercooked", "cooked", or "overcooked".
The robot interacts with the user for each food item, allowing them to specify whether it's undercooked, cooked, or overcooked.
Example Output:
Robot is going to the kitchen to inspect the food...

Inspecting steak...
Robot grabs the steak from the pan.
Enter the state of the steak (undercooked, cooked, overcooked): undercooked
Inspecting steak... It is undercooked.
Chef is cooking the food more...
Enter the state of the steak (undercooked, cooked, overcooked): cooked
The steak is cooked well. Serving it to the guests.

Inspecting chicken...
Robot grabs the chicken from the pan.
Enter the state of the chicken (undercooked, cooked, overcooked): overcooked
The chicken is overcooked. Throwing it away.

Inspecting pasta...
Robot grabs the pasta from the pan.
Enter the state of the pasta (undercooked, cooked, overcooked): cooked
The pasta is cooked well. Serving it to the guests.
How it Works:
The robot prompts the user to specify which food item is being inspected.
The user enters the state of that food item (undercooked, cooked, or overcooked).
If the food is undercooked, the robot asks the chef to cook it more and re-checks.
If the food is overcooked, the robot discards it.
If the food is cooked well, the robot serves it to the guests.
"""