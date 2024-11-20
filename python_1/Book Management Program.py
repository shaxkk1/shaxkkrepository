# Book Management Program

# Function to display the menu
def display_menu():
    """
    Displays the menu options for the user.
    """
    print("\nBook Management System")
    print("1. Add a new book")
    print("2. View all books")
    print("3. Search for a book by title")
    print("4. Exit")

# Function to add a new book to the library
def add_book(library):
    """
    Prompts the user for book details and adds the book to the library.
    
    Parameters:
    library (list): The list to store book information as dictionaries
    """
    book_title = input("Enter book title: ")
    book_author = input("Enter book author: ")
    num_copies = int(input("Enter number of copies available: "))

    # Create a dictionary to represent the book and add it to the library
    book = {"title": book_title, "author": book_author, "copies": num_copies}
    library.append(book)
    print(f"Book '{book_title}' by {book_author} added successfully!")

# Function to view all books in the library
def view_books(library):
    """
    Displays all books currently in the library.
    
    Parameters:
    library (list): The list containing all books
    """
    if not library:
        print("No books available in the library.")
    else:
        print("\nBooks in Library:")
        for book in library:
            print(f"Title: {book['title']}, Author: {book['author']}, Copies: {book['copies']}")

# Function to search for a book by title
def search_book(library, search_title):
    """
    Searches for a book by title and displays its details if found.
    
    Parameters:
    library (list): The list containing all books
    search_title (str): The title of the book to search for
    """
    found = False
    for book in library:
        if book['title'].lower() == search_title.lower():
            print(f"Book found: Title: {book['title']}, Author: {book['author']}, Copies: {book['copies']}")
            found = True
            break
    if not found:
        print(f"No book found with the title '{search_title}'.")

# Main program
def main():
    """
    The main function to run the book management system.
    """
    library = []  # List to hold books as dictionaries

    while True:
        display_menu()
        choice = input("Choose an option (1-4): ")

        if choice == '1':
            add_book(library)
        elif choice == '2':
            view_books(library)
        elif choice == '3':
            title_to_search = input("Enter the title of the book to search: ")
            search_book(library, title_to_search)
        elif choice == '4':
            print("Exiting program.")
            break
        else:
            print("Invalid choice. Please select a valid option.")

# Run the program
main()

"""
Explanation of how the code meets each criterion:
Descriptive Variable Names:
library, book_title, book_author, num_copies, search_title, and choice are descriptive variable names.
Three Distinct Data Types:
String: book_title, book_author, and search_title are strings.
Integer: num_copies is an integer.
List: library is a list that stores dictionaries representing books.
Decision Making with Decision Structures:
The program uses if-elif-else structures to handle user choices for adding books, viewing books, searching, and exiting.
Repeated Tasks with Looping Structures:
The program uses a while True loop to repeatedly display the menu and handle user choices until the user decides to exit.
Reusable Functions:
Custom functions such as display_menu, add_book, view_books, and search_book are used to modularize the code and handle specific tasks.
Collections of Data with Sequences (Lists):
The library list stores multiple books, each represented by a dictionary. The for loop iterates over the list to display book information or perform searches.
Documentation:
Each function has a docstring explaining its purpose (e.g., add_book explains that it adds a new book to the library).
"""