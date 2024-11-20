# Task Organizer Program

# Function to display the menu options
def display_menu():
    """
    Displays the menu options for the user.
    """
    print("\nTask Organizer")
    print("1. Add a new task")
    print("2. View all tasks")
    print("3. Mark a task as completed")
    print("4. Remove a task")
    print("5. Exit")

# Function to add a new task to the task list
def add_task(task_list):
    """
    Prompts the user to enter a task and adds it to the task list.
    
    Parameters:
    task_list (list): The list that holds all tasks as dictionaries
    """
    task_name = input("Enter the task name: ")
    task_priority = input("Enter the task priority (low, medium, high): ")
    task_status = "Not Completed"  # Default status for new tasks

    # Create a dictionary for the task and add it to the task list
    task = {"name": task_name, "priority": task_priority, "status": task_status}
    task_list.append(task)
    print(f"Task '{task_name}' with priority '{task_priority}' added to your list.")

# Function to view all tasks
def view_tasks(task_list):
    """
    Displays all tasks in the task list.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    if not task_list:
        print("No tasks available in your list.")
    else:
        print("\nTasks in Task List:")
        for task in task_list:
            print(f"Task: {task['name']}, Priority: {task['priority']}, Status: {task['status']}")

# Function to mark a task as completed
def mark_task_completed(task_list):
    """
    Marks a specific task as completed based on its name.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    task_name = input("Enter the task name to mark as completed: ")
    for task in task_list:
        if task['name'].lower() == task_name.lower():
            task['status'] = "Completed"
            print(f"Task '{task_name}' marked as completed.")
            return
    print(f"Task '{task_name}' not found.")

# Function to remove a task from the task list
def remove_task(task_list):
    """
    Removes a task from the task list based on its name.
    
    Parameters:
    task_list (list): The list containing all tasks
    """
    task_name = input("Enter the task name to remove: ")
    for task in task_list:
        if task['name'].lower() == task_name.lower():
            task_list.remove(task)
            print(f"Task '{task_name}' removed from your list.")
            return
    print(f"Task '{task_name}' not found.")

# Main program to run the task organizer system
def main():
    """
    The main function that runs the task organizer system.
    """
    task_list = []  # List to store tasks as dictionaries

    while True:
        display_menu()  # Show the menu to the user
        user_choice = input("Choose an option (1-5): ")

        if user_choice == '1':
            add_task(task_list)
        elif user_choice == '2':
            view_tasks(task_list)
        elif user_choice == '3':
            mark_task_completed(task_list)
        elif user_choice == '4':
            remove_task(task_list)
        elif user_choice == '5':
            print("Exiting the task organizer.")
            break
        else:
            print("Invalid choice. Please choose a valid option.")

# Run the program
main()
"""
Explanation of how the code meets each criterion:
Descriptive Variable Names:
task_list, task_name, task_priority, task_status, user_choice are all descriptive variable names. These names clearly reflect the purpose of each variable.
Three Distinct Data Types:
String: task_name, task_priority, task_status, and user_choice are all strings.
List: task_list is a list that holds multiple tasks.
Dictionary: Each task is stored as a dictionary with name, priority, and status as keys.
Decision Making with Decision Structures:
The program uses if-elif-else statements to manage user choices: adding tasks, viewing tasks, marking tasks as completed, removing tasks, and exiting.
Repeated Tasks with Looping Structures:
The program uses a while True loop to keep running, allowing the user to perform actions repeatedly until they choose to exit.
Reusable Functions:
Functions like display_menu, add_task, view_tasks, mark_task_completed, and remove_task modularize the program, making the code more organized and reusable.
Collections of Data with Sequences (Lists):
The task_list is a list that stores tasks. The program iterates over this list using a for loop to display tasks and perform operations such as marking them completed or removing them.
Documentation:
Each function has a docstring explaining its purpose, parameters, and functionality. For example, add_task explains how it adds a new task to the list, while view_tasks shows the list of tasks.
"""