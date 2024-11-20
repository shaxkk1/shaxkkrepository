# Student Grade Tracker Program

# Function to display the menu
def display_menu():
    """
    Displays the menu options for the user to choose from.
    """
    print("\nStudent Grade Tracker")
    print("1. Add a student and their grade")
    print("2. View all students and their grades")
    print("3. Calculate the average grade")
    print("4. Remove a student")
    print("5. Exit")

# Function to add a student and their grade
def add_student(student_list):
    """
    Prompts the user to enter the student's name and grade, then adds it to the student list.
    
    Parameters:
    student_list (list): The list storing student names and grades
    """
    student_name = input("Enter the student's name: ")
    student_grade = float(input(f"Enter {student_name}'s grade: "))
    
    # Create a dictionary to represent the student and grade, and append it to the list
    student = {"name": student_name, "grade": student_grade}
    student_list.append(student)
    print(f"Student {student_name} with grade {student_grade} added.")

# Function to view all students and their grades
def view_students(student_list):
    """
    Displays all students and their grades.
    
    Parameters:
    student_list (list): The list containing all students and their grades
    """
    if not student_list:
        print("No students in the list.")
    else:
        print("\nStudents and their grades:")
        for student in student_list:
            print(f"Name: {student['name']}, Grade: {student['grade']}")

# Function to calculate the average grade
def calculate_average_grade(student_list):
    """
    Calculates and displays the average grade of all students in the list.
    
    Parameters:
    student_list (list): The list containing all students and their grades
    """
    if not student_list:
        print("No students in the list to calculate the average grade.")
    else:
        total_grades = sum(student['grade'] for student in student_list)
        average_grade = total_grades / len(student_list)
        print(f"The average grade of all students is: {average_grade:.2f}")

# Function to remove a student from the list
def remove_student(student_list):
    """
    Removes a student from the list based on their name.
    
    Parameters:
    student_list (list): The list containing all students and their grades
    """
    student_name = input("Enter the name of the student to remove: ")
    found = False
    for student in student_list:
        if student['name'].lower() == student_name.lower():
            student_list.remove(student)
            found = True
            print(f"Student {student_name} has been removed.")
            break
    if not found:
        print(f"Student {student_name} not found in the list.")

# Main program
def main():
    """
    The main function that runs the student grade tracker program.
    """
    student_list = []  # List to store student names and their grades

    while True:
        display_menu()
        choice = input("Choose an option (1-5): ")

        if choice == '1':
            add_student(student_list)
        elif choice == '2':
            view_students(student_list)
        elif choice == '3':
            calculate_average_grade(student_list)
        elif choice == '4':
            remove_student(student_list)
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
student_list, student_name, student_grade, choice are all descriptive and easy to understand.
Three Distinct Data Types:
String: student_name and choice are strings.
Float: student_grade is a float representing the student's grade.
List: student_list is a list that stores dictionaries (representing students and their grades).
Decision Making with Decision Structures:
The program uses if-elif-else decision structures to handle the user’s menu choices (add student, view students, calculate average grade, remove student, or exit).
Repeated Tasks with Looping Structures:
The while True loop allows the user to repeatedly interact with the menu options until they choose to exit.
Reusable Functions:
Functions such as display_menu, add_student, view_students, calculate_average_grade, and remove_student are modular and reusable, each performing a specific task.
Collections of Data with Sequences (Lists):
The student_list is a list that stores dictionaries. Each dictionary holds a student's name and grade. The program iterates through this list in the view_students and calculate_average_grade functions.
Documentation:
Each function has a docstring that describes its purpose and parameters. For example, the add_student function explains that it adds a new student and their grade to the list, and the calculate_average_grade function explains that it calculates the average grade of all students in the list.
"""