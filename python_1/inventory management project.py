# Inventory management program
'''
This program simulates a simple inventory management system where you can add items, 
list current items, and calculate the total cost of items in the inventory.
'''
# Function to display the menu
def display_menu():
    """
    Displays the menu options for the user.
    """
    print("\nInventory Management System")
    print("1. Add an item")
    print("2. View all items")
    print("3. Calculate total inventory value")
    print("4. Exit")

# Function to add an item to the inventory
def add_item(inventory):
    """
    Prompts the user for item details and adds the item to the inventory.
    
    Parameters:
    inventory (list): The list to store items as dictionaries
    """
    item_name = input("Enter item name: ")
    item_quantity = int(input("Enter item quantity: "))
    item_price = float(input("Enter item price: "))

    # Create a dictionary to represent an item and add it to the inventory
    item = {"name": item_name, "quantity": item_quantity, "price": item_price}
    inventory.append(item)
    print(f"Item '{item_name}' added successfully!")

# Function to display all items in the inventory
def view_items(inventory):
    """
    Displays all items currently in the inventory.
    
    Parameters:
    inventory (list): The list containing all items
    """
    if not inventory:
        print("No items in the inventory.")
    else:
        print("\nInventory Items:")
        for item in inventory:
            print(f"Name: {item['name']}, Quantity: {item['quantity']}, Price: ${item['price']:.2f}")

# Function to calculate the total value of the inventory
def calculate_total_value(inventory):
    """
    Calculates and displays the total value of all items in the inventory.
    
    Parameters:
    inventory (list): The list containing all items
    """
    total_value = 0.0
    for item in inventory:
        total_value += item["quantity"] * item["price"]
    print(f"\nTotal Inventory Value: ${total_value:.2f}")

# Main program
def main():
    """
    The main function to run the inventory management system.
    """
    inventory = []  # List to hold inventory items

    while True:
        display_menu()
        choice = input("Choose an option (1-4): ")

        if choice == '1':
            add_item(inventory)
        elif choice == '2':
            view_items(inventory)
        elif choice == '3':
            calculate_total_value(inventory)
        elif choice == '4':
            print("Exiting program.")
            break
        else:
            print("Invalid choice. Please select a valid option.")

# Run the program
main()

'''
Explanation of how the code meets each criterion:
- Descriptive Variable Names: All variables, like item_name, item_quantity, inventory, and total_value, are descriptive.
- Three Distinct Data Types: The code uses strings (item_name), integers (item_quantity), and floats (item_price).
- Decision Making with Decision Structures: The code uses an if-elif-else decision structure to handle user choices.
- Repeated Tasks with Looping Structures: The while True loop allows the user to repeatedly interact with the menu until they choose to exit.
- Reusable Functions: There are custom functions (display_menu, add_item, view_items, and calculate_total_value) to modularize tasks.
- Collections of Data with Sequences (Lists): The inventory list stores dictionaries, each representing an item in the inventory.
- Documentation: Each function has a docstring explaining its purpose.
'''