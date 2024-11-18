# variables
'''
Variables are a way for your program to remember information
Whether it is a string, an integer, or a float
Make sure variable names are descriptive, so that the program is easy to code
'''
# Snake Case
first_name = "Sean" #This is a string

#Camel case
#Camel case because the variable name looks like the hump of a camel.
lastName = "Dao" # This is also a string
nickName = "Sugar Sean" # This is also a string 

age = 16 # This is an int (integer)
bankAccountBalance = 18346.34 # This is a float

print( first_name )
print( bankAccountBalance )

# Command k, command t to scroll through different themes 

# if statements
if bankAccountBalance > 100: #Only time this will run is if bankAccountBalance is over 100
    print("Sugar Sean with the fireman's carry. Watch your back!!") # This is a string

if age >= 18:
    print("You are eligable to vote!")
else:
    print("You can't vote yet buddy. Sorry.")
# Command forward slash to make code a comment

# Simple mini application for applesauce program

print("Welcome to the APPLE SAUCE PROGRAM")

while True:
    # Get the user's input
    userAppleSauceCount = int(input("How many apple sauces would you like: "))
    
    # Check if the input is less than 1
    if userAppleSauceCount < 1:
        print("Please enter a number greater than 0.")
    else:
        # If valid input, break the loop
        print("The user said", userAppleSauceCount)
        break

'''
Explanation of while loop
- The program enters a while loop, which will continue until the user enters a valid number.
- Inside the loop, it prompts for input and checks if the entered number is less than 1.
- If the input is invalid, it displays a message and prompts again.
- When the input is valid, it displays the number and exits the loop.
'''
