# Task Manager Program

# Function to display the menu
def display_menu():
    """
    Displays the menu options for the user.
    """
    print("\nTask Manager System")
    print("1. Add a new task")
    print("2. View all tasks")
    print("3. Mark a task as complete")
    print("4. Remove a task")
    print("5. Exit")

# Function to add a new task
def add_task(task_list):
    """
    Prompts the user for task details and adds the task to the task list.
    
    Parameters:
    task_list (list): The list that stores tasks as dictionaries
    """
    task_name = input("Enter task name: ")
    task_priority = input("Enter task priority (low, medium, high): ")
    task_status = "Incomplete"  # Default status for new tasks
    
    # Create a dictionary to represent the task and add it to the task list
    task = {"name": task_name, "priority": task_priority, "status": task_status}
    task_list.append(task)
    print(f"Task '{task_name}' added successfully!")

# Function to view all tasks
def view_tasks(task_list):
    """
    Displays all tasks currently in the task list.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    if not task_list:
        print("No tasks in the task list.")
    else:
        print("\nTasks in Task List:")
        for task in task_list:
            print(f"Name: {task['name']}, Priority: {task['priority']}, Status: {task['status']}")

# Function to mark a task as complete
def mark_task_complete(task_list):
    """
    Marks a specified task as complete based on its name.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    task_name = input("Enter the name of the task to mark as complete: ")
    for task in task_list:
        if task["name"].lower() == task_name.lower():
            task["status"] = "Complete"
            print(f"Task '{task_name}' marked as complete.")
            return
    print(f"Task '{task_name}' not found.")

# Function to remove a task from the list
def remove_task(task_list):
    """
    Removes a task from the task list based on its name.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    task_name = input("Enter the name of the task to remove: ")
    for task in task_list:
        if task["name"].lower() == task_name.lower():
            task_list.remove(task)
            print(f"Task '{task_name}' removed from the list.")
            return
    print(f"Task '{task_name}' not found.")

# Main program
def main():
    """
    The main function to run the task manager system.
    """
    task_list = []  # List to hold tasks as dictionaries

    while True:
        display_menu()
        choice = input("Choose an option (1-5): ")

        if choice == '1':
            add_task(task_list)
        elif choice == '2':
            view_tasks(task_list)
        elif choice == '3':
            mark_task_complete(task_list)
        elif choice == '4':
            remove_task(task_list)
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
task_list, task_name, task_priority, task_status, and choice are all descriptive variable names.
Three Distinct Data Types:
String: task_name, task_priority, and task_status are strings.
List: task_list is a list of tasks.
Dictionary: Each task is stored as a dictionary with keys name, priority, and status.
Decision Making with Decision Structures:
The program uses if-elif-else structures to handle user choices for adding tasks, viewing tasks, marking tasks as complete, removing tasks, and exiting.
Repeated Tasks with Looping Structures:
The while True loop keeps the program running and allows the user to interact with the menu repeatedly until they choose to exit.
Reusable Functions:
Custom functions like display_menu, add_task, view_tasks, mark_task_complete, and remove_task help modularize the code and handle specific tasks.
Collections of Data with Sequences (Lists):
The task_list is a list that stores each task as a dictionary. The program iterates over this list in the view_tasks function and during task searches.
Documentation:
Each function includes a docstring that explains its purpose and how it interacts with the task list.
"""