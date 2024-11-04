import random

# Main Dishes
main_dishes = [
    "Roast Turkey",
    "Honey-Glazed Ham",
    "Herb-Crusted Chicken",
    "Vegan Lentil Loaf"
]

# Side Dishes
side_dishes = [
    "Mashed Potatoes",
    "Green Bean Casserole",
    "Cranberry Sauce",
    "Stuffing",
    "Roasted Brussels Sprouts",
    "Sweet Potato Casserole",
    "Cornbread"
]

# Desserts
desserts = [
    "Pumpkin Pie",
    "Pecan Pie",
    "Apple Pie",
    "Cheesecake",
    "Cranberry Cobbler"
]

# Drinks
drinks = [
    "Apple Cider",
    "Sparkling Water",
    "Red Wine",
    "Hot Chocolate",
    "Coffee"
]

# Function to generate a meal plan
def generate_thanksgiving_meal():
    print("Your Thanksgiving Meal Plan:")
    
    # Randomly select 1 main dish
    main_dish = random.choice(main_dishes)
    
    # Randomly select 3 side dishes
    selected_sides = random.sample(side_dishes, 3)
    
    # Randomly select 1 dessert
    dessert = random.choice(desserts)
    
    # Randomly select 1 drink
    drink = random.choice(drinks)
    
    # Display the meal plan
    print(f"\nMain Dish: {main_dish}")
    print("\nSide Dishes:")
    for side in selected_sides:
        print(f" - {side}")
    print(f"\nDessert: {dessert}")
    print(f"\nDrink: {drink}")

# Run the meal plan generator
if __name__ == "__main__":
    generate_thanksgiving_meal()
