# Grocery List Manager Program

# Function to display the menu
def display_menu():
    """
    Displays the menu options for the user to choose from.
    """
    print("\nGrocery List Manager")
    print("1. Add an item")
    print("2. View all items")
    print("3. Check if an item is on the list")
    print("4. Remove an item")
    print("5. Exit")

# Function to add an item to the grocery list
def add_item(grocery_list):
    """
    Prompts the user to enter an item and adds it to the grocery list.
    
    Parameters:
    grocery_list (list): The list storing all grocery items
    """
    item_name = input("Enter the name of the item to add: ")
    item_quantity = int(input(f"Enter the quantity of {item_name}: "))
    item_price = float(input(f"Enter the price of {item_name}: $"))
    
    # Create a dictionary for the item and append to the grocery list
    item = {"name": item_name, "quantity": item_quantity, "price": item_price}
    grocery_list.append(item)
    print(f"{item_quantity} x {item_name} added to your list.")

# Function to view all items in the grocery list
def view_items(grocery_list):
    """
    Displays all the items in the grocery list.
    
    Parameters:
    grocery_list (list): The list containing all grocery items
    """
    if not grocery_list:
        print("Your grocery list is empty.")
    else:
        print("\nGrocery List:")
        for item in grocery_list:
            print(f"{item['quantity']} x {item['name']} at ${item['price']:.2f} each")

# Function to check if an item is on the grocery list
def check_item(grocery_list):
    """
    Checks if a specific item is on the grocery list.
    
    Parameters:
    grocery_list (list): The list containing all grocery items
    """
    item_name = input("Enter the name of the item to check: ")
    found = False
    for item in grocery_list:
        if item['name'].lower() == item_name.lower():
            found = True
            print(f"Yes, {item_name} is on your list.")
            break
    if not found:
        print(f"{item_name} is not on your list.")

# Function to remove an item from the grocery list
def remove_item(grocery_list):
    """
    Removes a specified item from the grocery list.
    
    Parameters:
    grocery_list (list): The list containing all grocery items
    """
    item_name = input("Enter the name of the item to remove: ")
    for item in grocery_list:
        if item['name'].lower() == item_name.lower():
            grocery_list.remove(item)
            print(f"{item_name} has been removed from your list.")
            return
    print(f"{item_name} is not on your list.")

# Main program
def main():
    """
    The main function that runs the grocery list manager program.
    """
    grocery_list = []  # List to store grocery items

    while True:
        display_menu()
        choice = input("Choose an option (1-5): ")

        if choice == '1':
            add_item(grocery_list)
        elif choice == '2':
            view_items(grocery_list)
        elif choice == '3':
            check_item(grocery_list)
        elif choice == '4':
            remove_item(grocery_list)
        elif choice == '5':
            print("Exiting program.")
            break
        else:
            print("Invalid choice. Please select a valid option.")

# Run the program
main()
"""
Explanation of how the code meets each criterion:
Descriptive Variable Names:
grocery_list, item_name, item_quantity, item_price, and choice are all descriptive variable names.
Three Distinct Data Types:
String: item_name and choice are strings.
Integer: item_quantity is an integer.
Float: item_price is a float.
List: grocery_list is a list that stores multiple items (represented as dictionaries).
Decision Making with Decision Structures:
The program uses if-elif-else statements to handle the user's choices (add, view, check, remove, or exit).
Repeated Tasks with Looping Structures:
The while True loop allows the user to perform actions repeatedly (adding, viewing, checking, or removing items) until they decide to exit.
Reusable Functions:
Custom functions like display_menu, add_item, view_items, check_item, and remove_item help modularize the code and keep it organized.
Collections of Data with Sequences (Lists):
The grocery_list is a list that stores dictionaries. The list is iterated over in the view_items and check_item functions to access and use the elements.
Documentation:
Each function is documented with a docstring that explains its purpose, parameters, and behavior. For example, the add_item function explains that it adds a new item to the grocery list.
"""