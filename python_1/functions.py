# 11/13/24 code

# Function to display a tagline. Using a function avoids repeating the same lines of code multiple times.
def sayTagLine(): 
    # Inside the function, these lines will execute whenever the function is called
    print("Stop playing!!!")  # First line of the tagline
    print("It's KayPinky!!!")  # Second line of the tagline, repeated three times
    print("It's KayPinky!!!")  
    print("It's KayPinky!!!")

# Calling the function 'sayTagLine' to display the tagline
sayTagLine()  # Only defining the function does not run it. This line actually calls it.

# Function to display the calculator menu options to the user
def displayMenu():
    print("Welcome to our calculator") 
    print("1: addition")  # Option 1: Addition
    print("2: subtraction")  # Option 2: Subtraction
    print("3: multiplication")  # Option 3: Multiplication
    print("4: division")  # Option 4: Division

# Function to perform addition of two numbers and print the result
def addNumbers(firstNumber, secondNumber):
    sum = firstNumber + secondNumber  # Perform addition
    # Convert numbers to strings to avoid TypeError in concatenation
    print("The sum of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(sum))

# Function to perform subtraction of two numbers and print the result
def subtractNumbers(firstNumber, secondNumber):
    difference = firstNumber - secondNumber  # Perform subtraction
    print("The difference of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(difference))

# Function to perform multiplication of two numbers and print the result
def multiplyNumbers(firstNumber, secondNumber):
    product = firstNumber * secondNumber  # Perform multiplication
    print("The product of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(product))

# Function to perform division of two numbers and print the result
def divideNumbers(firstNumber, secondNumber):
    # Check if secondNumber is not zero to avoid division by zero error
    if secondNumber != 0:  # != means "not equal to"
        quotient = firstNumber / secondNumber  # Perform division
        print("The quotient of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(quotient))
    else:
        print("Error: Cannot divide by zero.")  # Handle division by zero case

# Call addNumbers as an example with hardcoded values
addNumbers(4, 5)  # Expected output: The sum of 4 and 5 is 9
addNumbers(6, 11)  # Expected output: The sum of 6 and 11 is 17

# Main program logic
def main():
    """
    The main function handles the program flow and user interaction.
    """
    """                  0            1             2               3           4   
    """
    allFeatures = ["Addition", "Subtraction", "Division", "Multiplication", "Modulus"]
    # Display the menu to the user, showing available operations
    #displayMenu()
    
    print("Here are the features in the application: ")

# Start the loop
    # Iterate over all features in the list and print each one
    for currentFeature in allFeatures:
        print(currentFeature)

    # Advance Loop
    # Print the third feature in the list (index 2 since indexing starts at 0)
    print("\nSelected feature (Index 2):")
    print(allFeatures[2])

    print("\nIterating through all features using index-based access:")
    # Iterate over the list using index-based access
    for currentFeatureIndex in range(len(allFeatures)):
        print(allFeatures[currentFeatureIndex])
    
    # Get the user's choice of operation (1-4)
    try:
        userOption = int(input("\nPlease select an option (1-4): "))
        
        # Get user input for the numbers to perform the operation on
        userFirstNumber = int(input("What's your first number: "))
        userSecondNumber = int(input("What's your second number: "))
        
        # Execute the selected operation based on user's choice
        if userOption == 1:
            addNumbers(userFirstNumber, userSecondNumber)
        elif userOption == 2:
            subtractNumbers(userFirstNumber, userSecondNumber)
        elif userOption == 3:
            multiplyNumbers(userFirstNumber, userSecondNumber)
        elif userOption == 4:
            divideNumbers(userFirstNumber, userSecondNumber)
        else:
            # If the user selects an invalid option, print an error message
            print("Invalid option selected. Please choose a number between 1 and 4.")
    except ValueError:
        print("Invalid input. Please enter numbers only.")

# Call the main function to start the program
if __name__ == "__main__":
    main()