# 11/13/24 code
def sayTagLine(): # function to make sure not to repeat the same lines over and over again
    print("Stop playing!!!") #indentation is very important as the code needs to be inside the function 
    print("It's KayPinky!!!")
    print("It's KayPinky!!!")
    print("It's KayPinky!!!")

sayTagLine() #call the function. Only defining the function will not do anything.

def displayMenu():
    print("Welcome to our calculator") 
    print("1: addition")
    print("2: subtraction")
    print("3: multiplication")
    print("4: division")

def addNumbers(firstNumber, secondNumber):
    sum = firstNumber + secondNumber
    # Convert numbers to strings to avoid TypeError in concatenation
    print("The sum of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(sum))

def subtractNumbers(firstNumber, secondNumber):
    difference = firstNumber - secondNumber
    print("The difference of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(difference))

def multiplyNumbers(firstNumber, secondNumber):
    product = firstNumber * secondNumber
    print("The product of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(product))

def divideNumbers(firstNumber, secondNumber):
    if secondNumber != 0:
        quotient = firstNumber / secondNumber
        print("The quotient of " + str(firstNumber) + " and " + str(secondNumber) + " is " + str(quotient))
    else:
        print("Error: Cannot divide by zero.")

# Call addNumbers as an example
addNumbers(4, 5)  # Expected output: The sum of 4 and 5 is 9
addNumbers(6, 11)  # Expected output: The sum of 6 and 11 is 17

# Main program logic
def main():
    # Display menu to the user
    displayMenu()
    
    # Get the user's choice
    userOption = int(input("Please select an option (1-4): "))
    
    # Get user input and convert to integers for the numbers
    userFirstNumber = int(input("What's your first number: ")) # We convert to integers because you can't do math with strings
    userSecondNumber = int(input("What's your second number: "))
    
    # Execute the chosen operation
    if userOption == 1:
        addNumbers(userFirstNumber, userSecondNumber)
    elif userOption == 2:
        subtractNumbers(userFirstNumber, userSecondNumber)
    elif userOption == 3:
        multiplyNumbers(userFirstNumber, userSecondNumber)
    elif userOption == 4:
        divideNumbers(userFirstNumber, userSecondNumber)
    else:
        print("Invalid option selected. Please choose a number between 1 and 4.")

# Call the main function to run the program
main()