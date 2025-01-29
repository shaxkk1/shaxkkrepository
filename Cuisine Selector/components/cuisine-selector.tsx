"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const cuisines = [
  "Mexican",
  "Italian",
  "Chinese",
  "Japanese",
  "Indian",
  "Greek",
  "French",
  "Spanish",
  "Turkish",
  "Lebanese",
  "Vietnamese",
  "Korean",
  "Argentinian",
  "Peruvian",
  "Ethiopian",
  "Nigerian",
  "German",
  "British",
  "Irish",
  "Swedish",
  "Danish",
  "Polish",
  "Hungarian",
  "Portuguese",
]

function getRecommendation(selectedCuisines: string[]): string {
  if (selectedCuisines.length === 0) {
    return "Please select at least one cuisine to get a recommendation."
  }

  if (selectedCuisines.length === 1) {
    return `How about trying a popular ${selectedCuisines[0]} dish?`
  }

  const randomCuisine1 = selectedCuisines[Math.floor(Math.random() * selectedCuisines.length)]
  let randomCuisine2 = selectedCuisines[Math.floor(Math.random() * selectedCuisines.length)]

  while (randomCuisine2 === randomCuisine1 && selectedCuisines.length > 1) {
    randomCuisine2 = selectedCuisines[Math.floor(Math.random() * selectedCuisines.length)]
  }

  return `How about trying a fusion of ${randomCuisine1} and ${randomCuisine2} cuisines?`
}

type Meal = {
  time: string
  type: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Dessert"
  cuisine: string
  dish: string
  description: string
}

type DailyMealPlan = {
  day: string
  meals: Meal[]
}

function generateMealPlan(selectedCuisines: string[]): DailyMealPlan[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealPlan: DailyMealPlan[] = []

  for (let i = 0; i < 7; i++) {
    const dailyMeals: Meal[] = [
      { time: "8:00 AM", type: "Breakfast", ...getRandomMeal(selectedCuisines, "Breakfast") },
      { time: "12:30 PM", type: "Lunch", ...getRandomMeal(selectedCuisines, "Lunch") },
      { time: "4:00 PM", type: "Snack", ...getRandomMeal(selectedCuisines, "Snack") },
      { time: "7:30 PM", type: "Dinner", ...getRandomMeal(selectedCuisines, "Dinner") },
      { time: "9:00 PM", type: "Dessert", ...getRandomMeal(selectedCuisines, "Dessert") },
    ]

    mealPlan.push({
      day: days[i],
      meals: dailyMeals,
    })
  }

  return mealPlan
}

function getRandomMeal(
  selectedCuisines: string[],
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Dessert",
): { cuisine: string; dish: string; description: string } {
  const randomCuisine = selectedCuisines[Math.floor(Math.random() * selectedCuisines.length)]
  return getRandomDish(randomCuisine, mealType)
}

const genericDishes = {
  Breakfast: [
    { name: "Omelette", description: "Fluffy eggs filled with cheese and vegetables" },
    { name: "Pancakes", description: "Soft, flat cakes made from batter and fried on a griddle" },
    { name: "Fruit Salad", description: "A mix of fresh, seasonal fruits" },
    { name: "Yogurt with Granola", description: "Creamy yogurt topped with crunchy granola and honey" },
    { name: "Toast with Jam", description: "Crispy bread slices with sweet fruit preserve" },
  ],
  Lunch: [
    { name: "Sandwich", description: "Fillings between two slices of bread" },
    { name: "Salad", description: "A mix of fresh vegetables with dressing" },
    { name: "Soup", description: "A warm, comforting liquid food" },
    { name: "Wrap", description: "Fillings rolled in a soft flatbread" },
    { name: "Pasta", description: "Noodles served with sauce and toppings" },
  ],
  Snack: [
    { name: "Fruit", description: "A piece or serving of fresh fruit" },
    { name: "Nuts", description: "A handful of nutritious tree nuts" },
    { name: "Cheese and Crackers", description: "Savory cheese served with crisp crackers" },
    { name: "Vegetable Sticks", description: "Fresh-cut vegetables for dipping" },
    { name: "Smoothie", description: "A blended drink made from fruits and/or vegetables" },
  ],
  Dinner: [
    { name: "Grilled Chicken", description: "Chicken cooked over flames for a smoky flavor" },
    { name: "Steak", description: "A cut of beef cooked to preference" },
    { name: "Fish", description: "A fillet of fish, often baked or pan-fried" },
    { name: "Vegetable Stir Fry", description: "Mixed vegetables quickly fried in a pan" },
    { name: "Roasted Vegetables", description: "A medley of vegetables oven-roasted for deep flavor" },
  ],
  Dessert: [
    { name: "Chocolate Cake", description: "Rich, moist cake made with cocoa" },
    { name: "Fruit Pie", description: "Flaky pastry filled with sweet, cooked fruit" },
    { name: "Ice Cream", description: "Frozen dairy dessert in various flavors" },
    { name: "Cheesecake", description: "Creamy cake made with soft cheese on a cookie crust" },
    { name: "Pudding", description: "Soft, creamy dessert made from flavored milk and thickeners" },
  ],
}

function getRandomDish(
  cuisine: string,
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Dessert",
): { cuisine: string; dish: string; description: string } {
  const dishes: { [key: string]: { [key: string]: { name: string; description: string }[] } } = {
    Mexican: {
      Breakfast: [
        { name: "Huevos Rancheros", description: "Fried eggs served on corn tortillas with salsa" },
        { name: "Chilaquiles", description: "Tortilla chips simmered in salsa, topped with cheese and cream" },
        { name: "Mexican Omelette", description: "Omelette filled with peppers, onions, and cheese" },
        { name: "Breakfast Burrito", description: "Tortilla wrapped around eggs, cheese, and meat" },
        { name: "Molletes", description: "Open-faced sandwich with refried beans and melted cheese" },
      ],
      Lunch: [
        { name: "Tacos", description: "Folded tortillas filled with meat, vegetables, and salsa" },
        { name: "Enchiladas", description: "Rolled tortillas filled with meat and covered in chili sauce" },
        { name: "Quesadillas", description: "Tortilla filled with melted cheese and other ingredients" },
        { name: "Tostadas", description: "Crispy tortilla topped with beans, meat, and vegetables" },
        { name: "Pozole", description: "Rich soup made with hominy and meat" },
      ],
      Snack: [
        { name: "Elote", description: "Grilled corn on the cob with mayo, cheese, and chili powder" },
        { name: "Guacamole and Chips", description: "Avocado dip served with crispy tortilla chips" },
        { name: "Taquitos", description: "Rolled and fried tacos filled with meat or cheese" },
        { name: "Nachos", description: "Tortilla chips topped with melted cheese and various toppings" },
        { name: "Churros", description: "Fried dough pastry dusted with cinnamon sugar" },
      ],
      Dinner: [
        { name: "Fajitas", description: "Grilled meat with peppers and onions, served with tortillas" },
        { name: "Chiles Rellenos", description: "Stuffed peppers dipped in egg batter and fried" },
        { name: "Mole Poblano", description: "Rich sauce made with chocolate and chili, served over meat" },
        { name: "Carne Asada", description: "Grilled and sliced beef served with tortillas and salsa" },
        { name: "Tamales", description: "Steamed corn dough filled with meat or cheese" },
      ],
      Dessert: [
        { name: "Tres Leches Cake", description: "Sponge cake soaked in three types of milk" },
        { name: "Flan", description: "Creamy caramel custard dessert" },
        { name: "Sopapillas", description: "Fried pastry puffs drizzled with honey" },
        { name: "Churros con Chocolate", description: "Fried dough pastry served with thick hot chocolate" },
        { name: "Arroz con Leche", description: "Creamy rice pudding flavored with cinnamon" },
      ],
    },
    Italian: {
      Breakfast: [
        { name: "Cornetto and Cappuccino", description: "Italian croissant served with frothy coffee" },
        { name: "Frittata", description: "Open-faced omelette with various fillings" },
        { name: "Italian Breakfast Sandwich", description: "Crusty bread with prosciutto and cheese" },
        { name: "Ricotta Pancakes", description: "Fluffy pancakes made with ricotta cheese" },
        { name: "Crostata", description: "Breakfast tart filled with jam or fruit" },
      ],
      Lunch: [
        { name: "Pasta Carbonara", description: "Pasta with eggs, cheese, pancetta, and black pepper" },
        { name: "Caprese Salad", description: "Tomatoes, mozzarella, and basil drizzled with olive oil" },
        { name: "Panini", description: "Grilled sandwich with various fillings" },
        { name: "Minestrone Soup", description: "Hearty vegetable soup with pasta and beans" },
        { name: "Risotto", description: "Creamy rice dish cooked with broth and Parmesan" },
      ],
      Snack: [
        { name: "Bruschetta", description: "Grilled bread rubbed with garlic and topped with tomatoes" },
        { name: "Arancini", description: "Fried rice balls stuffed with meat and cheese" },
        { name: "Focaccia", description: "Oven-baked flatbread topped with herbs and olive oil" },
        { name: "Mozzarella Sticks", description: "Breaded and fried cheese sticks" },
        { name: "Gelato", description: "Italian-style ice cream in various flavors" },
      ],
      Dinner: [
        { name: "Pizza", description: "Thin-crust pizza with various toppings" },
        { name: "Lasagna", description: "Layered pasta dish with meat, cheese, and tomato sauce" },
        { name: "Osso Buco", description: "Braised veal shanks with vegetables" },
        { name: "Chicken Parmesan", description: "Breaded chicken topped with tomato sauce and melted cheese" },
        { name: "Seafood Linguine", description: "Pasta with mixed seafood in a light sauce" },
      ],
      Dessert: [
        { name: "Tiramisu", description: "Coffee-flavored dessert made with ladyfingers and mascarpone cheese" },
        { name: "Panna Cotta", description: "Silky, creamy dessert made with sweetened cream" },
        { name: "Cannoli", description: "Crisp pastry tubes filled with sweet ricotta cream" },
        { name: "Gelato", description: "Italian-style ice cream in various flavors" },
        { name: "Affogato", description: "Vanilla gelato 'drowned' with a shot of hot espresso" },
      ],
    },
    Chinese: {
      Breakfast: [
        { name: "Congee", description: "Rice porridge often served with various toppings" },
        { name: "Youtiao", description: "Chinese fried dough sticks" },
        { name: "Baozi", description: "Steamed buns filled with meat or vegetables" },
        { name: "Jianbing", description: "Savory crepe with egg, sauce, and crispy wonton" },
        { name: "Soy Milk and Youtiao", description: "Warm soy milk served with fried dough sticks" },
      ],
      Lunch: [
        { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts and vegetables" },
        { name: "Mapo Tofu", description: "Spicy tofu dish with minced meat and Sichuan peppercorns" },
        { name: "Dim Sum", description: "Variety of small dishes served in steamer baskets" },
        { name: "Fried Rice", description: "Stir-fried rice with vegetables, egg, and meat or seafood" },
        { name: "Beef with Broccoli", description: "Stir-fried beef and broccoli in a savory sauce" },
      ],
      Snack: [
        { name: "Spring Rolls", description: "Crispy rolls filled with vegetables and sometimes meat" },
        { name: "Egg Tarts", description: "Sweet pastry tarts with an egg custard filling" },
        { name: "Bubble Tea", description: "Tea-based drink with chewy tapioca pearls" },
        { name: "Scallion Pancakes", description: "Savory flatbread with scallions" },
        { name: "Siu Mai", description: "Open-topped dumplings usually filled with pork and shrimp" },
      ],
      Dinner: [
        { name: "Peking Duck", description: "Roasted duck known for its thin, crispy skin" },
        { name: "Hot Pot", description: "Communal dish of simmering soup for cooking various ingredients" },
        { name: "Mapo Tofu", description: "Spicy tofu dish with minced meat and Sichuan peppercorns" },
        { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts and vegetables" },
        { name: "Twice-Cooked Pork", description: "Pork belly that's boiled, then stir-fried with vegetables" },
      ],
      Dessert: [
        { name: "Tangyuan", description: "Sweet rice balls in ginger syrup" },
        { name: "Mango Pudding", description: "Creamy mango-flavored pudding" },
        { name: "Egg Tarts", description: "Sweet pastry tarts with an egg custard filling" },
        { name: "Almond Jelly", description: "Light almond-flavored gelatin dessert" },
        { name: "Red Bean Soup", description: "Sweet soup made from adzuki beans" },
      ],
    },
    Japanese: {
      Breakfast: [
        { name: "Tamago Kake Gohan", description: "Rice topped with raw egg and soy sauce" },
        { name: "Miso Soup", description: "Soybean paste soup with tofu and seaweed" },
        { name: "Tamagoyaki", description: "Rolled omelette made by folding together thin layers of seasoned egg" },
        { name: "Natto", description: "Fermented soybeans often eaten with rice" },
        { name: "Japanese Breakfast Set", description: "A set with rice, miso soup, grilled fish, and side dishes" },
      ],
      Lunch: [
        { name: "Bento Box", description: "A boxed meal with a variety of small dishes" },
        { name: "Ramen", description: "Noodle soup with various toppings" },
        { name: "Udon", description: "Thick wheat noodles served in hot soup or stir-fried" },
        { name: "Onigiri", description: "Rice balls wrapped in seaweed, often with a filling" },
        { name: "Katsu Curry", description: "Breaded, fried cutlet served with curry sauce and rice" },
      ],
      Snack: [
        { name: "Onigiri", description: "Rice balls wrapped in seaweed, often with a filling" },
        { name: "Edamame", description: "Boiled and salted immature soybeans in the pod" },
        { name: "Taiyaki", description: "Fish-shaped cake filled with sweet red bean paste" },
        { name: "Mochi", description: "Soft, pounded rice cake, often filled with sweet bean paste" },
        { name: "Dorayaki", description: "Sweet red bean paste sandwiched between two small pancakes" },
      ],
      Dinner: [
        { name: "Sushi", description: "Vinegared rice combined with various ingredients, often raw fish" },
        { name: "Tempura", description: "Lightly battered and deep-fried seafood and vegetables" },
        { name: "Yakitori", description: "Skewered and grilled chicken" },
        { name: "Sukiyaki", description: "Thin slices of beef cooked with vegetables in a sweet soy sauce broth" },
        { name: "Tonkatsu", description: "Breaded and deep-fried pork cutlet" },
      ],
      Dessert: [
        { name: "Matcha Ice Cream", description: "Green tea flavored ice cream" },
        { name: "Mochi Ice Cream", description: "Ice cream wrapped in a soft, pounded rice cake" },
        { name: "Daifuku", description: "Soft rice cake filled with sweet bean paste" },
        { name: "Castella", description: "Sponge cake made with honey, introduced by Portuguese merchants" },
        { name: "Anmitsu", description: "Traditional dessert with agar jelly, fruits, and sweet bean paste" },
      ],
    },
    Indian: {
      Breakfast: [
        { name: "Idli Sambar", description: "Steamed rice cakes served with lentil soup" },
        { name: "Aloo Paratha", description: "Flatbread stuffed with spiced potatoes" },
        { name: "Poha", description: "Flattened rice cooked with spices and vegetables" },
        { name: "Upma", description: "Savory semolina porridge with vegetables" },
        { name: "Masala Dosa", description: "Crispy fermented crepe filled with spiced potatoes" },
      ],
      Lunch: [
        { name: "Thali", description: "Assorted dishes served on a platter" },
        { name: "Biryani", description: "Fragrant rice dish cooked with meat or vegetables" },
        { name: "Chana Masala", description: "Spicy chickpea curry" },
        { name: "Palak Paneer", description: "Spinach curry with cubes of fresh cheese" },
        { name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato sauce" },
      ],
      Snack: [
        { name: "Samosas", description: "Fried pastry with savory filling" },
        { name: "Pakoras", description: "Vegetable fritters" },
        { name: "Vada Pav", description: "Spicy potato fritter in a bun" },
        { name: "Bhel Puri", description: "Puffed rice mixed with vegetables and tangy chutneys" },
        { name: "Masala Chai", description: "Spiced tea with milk" },
      ],
      Dinner: [
        { name: "Tandoori Chicken", description: "Yogurt and spice marinated chicken cooked in a clay oven" },
        { name: "Rogan Josh", description: "Aromatic lamb curry" },
        { name: "Malai Kofta", description: "Fried cheese and potato balls in a creamy sauce" },
        { name: "Fish Curry", description: "Fish cooked in a spicy, tangy sauce" },
        { name: "Naan and Curry", description: "Flatbread served with various curry dishes" },
      ],
      Dessert: [
        { name: "Gulab Jamun", description: "Deep-fried milk solids soaked in sugar syrup" },
        { name: "Rasgulla", description: "Soft cheese balls in light sugar syrup" },
        { name: "Kheer", description: "Rice pudding with nuts and cardamom" },
        { name: "Jalebi", description: "Deep-fried batter soaked in sugar syrup" },
        { name: "Kulfi", description: "Dense, creamy frozen dairy dessert" },
      ],
    },
    Greek: {
      Breakfast: [
        { name: "Greek Yogurt with Honey", description: "Thick yogurt drizzled with honey and nuts" },
        { name: "Spanakopita", description: "Spinach and feta cheese pie in phyllo pastry" },
        { name: "Bougatsa", description: "Sweet or savory pastry filled with custard or cheese" },
        { name: "Koulouri", description: "Sesame-covered bread rings" },
        { name: "Eggs with Tomatoes and Feta", description: "Scrambled eggs with tomatoes and feta cheese" },
      ],
      Lunch: [
        { name: "Greek Salad", description: "Salad with tomatoes, cucumbers, olives, and feta cheese" },
        { name: "Souvlaki", description: "Grilled meat skewers served with pita and tzatziki" },
        { name: "Gyros", description: "Pita wrap filled with meat, tomatoes, onions, and tzatziki" },
        { name: "Moussaka", description: "Layered eggplant and ground meat casserole" },
        { name: "Dolmades", description: "Stuffed grape leaves with rice and herbs" },
      ],
      Snack: [
        { name: "Tzatziki and Pita", description: "Yogurt-based dip with cucumbers and garlic, served with pita" },
        { name: "Tiropita", description: "Cheese-filled phyllo pastry" },
        { name: "Olives and Feta", description: "Assorted olives and feta cheese" },
        { name: "Keftedes", description: "Greek meatballs" },
        { name: "Saganaki", description: "Fried cheese appetizer" },
      ],
      Dinner: [
        { name: "Grilled Octopus", description: "Tender octopus grilled with olive oil and lemon" },
        { name: "Pastitsio", description: "Baked pasta dish with ground meat and béchamel sauce" },
        { name: "Lamb Kleftiko", description: "Slow-cooked lamb with vegetables and herbs" },
        { name: "Gemista", description: "Stuffed tomatoes and peppers with rice and herbs" },
        { name: "Grilled Sea Bass", description: "Whole grilled fish with lemon and olive oil" },
      ],
      Dessert: [
        { name: "Baklava", description: "Layered phyllo pastry with nuts and honey syrup" },
        { name: "Galaktoboureko", description: "Custard-filled phyllo pastry with syrup" },
        { name: "Loukoumades", description: "Deep-fried dough balls drizzled with honey and cinnamon" },
        { name: "Greek Yogurt with Fruit", description: "Thick yogurt topped with fresh fruits and honey" },
        { name: "Rizogalo", description: "Greek rice pudding with cinnamon" },
      ],
    },
    French: {
      Breakfast: [
        { name: "Croissant", description: "Flaky, buttery crescent-shaped pastry" },
        { name: "Pain au Chocolat", description: "Chocolate-filled pastry" },
        { name: "Baguette with Jam and Butter", description: "Sliced baguette served with butter and fruit preserves" },
        { name: "Café au Lait", description: "Coffee with hot milk" },
        { name: "Omelette", description: "Folded egg dish often filled with cheese or herbs" },
      ],
      Lunch: [
        { name: "Croque Monsieur", description: "Grilled ham and cheese sandwich" },
        { name: "Quiche Lorraine", description: "Savory tart with bacon and cheese" },
        { name: "Salade Niçoise", description: "Salad with tuna, olives, eggs, and vegetables" },
        { name: "Steak Frites", description: "Steak served with French fries" },
        { name: "Ratatouille", description: "Vegetable stew with eggplant, zucchini, and tomatoes" },
      ],
      Snack: [
        { name: "Cheese and Baguette", description: "Assorted French cheeses served with crusty bread" },
        { name: "Madeleines", description: "Small sponge cakes with a distinctive shell-like shape" },
        { name: "Macarons", description: "Colorful almond meringue sandwich cookies" },
        { name: "Pâté and Cornichons", description: "Meat paste served with small pickled gherkins" },
        { name: "Palmiers", description: "Sweet, crisp pastry shaped like a palm leaf or butterfly" },
      ],
      Dinner: [
        { name: "Coq au Vin", description: "Chicken braised in red wine with mushrooms and bacon" },
        { name: "Beef Bourguignon", description: "Beef stew braised in red wine" },
        { name: "Bouillabaisse", description: "Provençal fish stew" },
        { name: "Cassoulet", description: "Slow-cooked casserole with meat and white beans" },
        { name: "Duck Confit", description: "Duck leg preserved and cooked in its own fat" },
      ],
      Dessert: [
        { name: "Crème Brûlée", description: "Vanilla custard topped with caramelized sugar" },
        { name: "Tarte Tatin", description: "Upside-down caramelized apple tart" },
        { name: "Profiteroles", description: "Choux pastry balls filled with cream and topped with chocolate sauce" },
        { name: "Mousse au Chocolat", description: "Light and airy chocolate mousse" },
        { name: "Îles Flottantes", description: "Meringue floating on crème anglaise" },
      ],
    },
    Spanish: {
      Breakfast: [
        { name: "Tostada con Tomate", description: "Toasted bread rubbed with tomato, olive oil, and salt" },
        { name: "Churros con Chocolate", description: "Fried dough pastry served with thick hot chocolate" },
        { name: "Tortilla Española", description: "Spanish omelette with potatoes and onions" },
        { name: "Pan con Jamón", description: "Bread with Serrano ham" },
        { name: "Café con Leche", description: "Strong coffee with hot milk" },
      ],
      Lunch: [
        { name: "Paella", description: "Saffron rice dish with vegetables and meat or seafood" },
        { name: "Gazpacho", description: "Cold tomato soup" },
        { name: "Bocadillo de Calamares", description: "Fried squid sandwich" },
        { name: "Ensaladilla Rusa", description: "Spanish potato salad" },
        { name: "Cocido Madrileño", description: "Hearty chickpea and meat stew" },
      ],
      Snack: [
        { name: "Patatas Bravas", description: "Fried potatoes served with spicy tomato sauce" },
        { name: "Jamón Ibérico", description: "Cured ham from black Iberian pigs" },
        { name: "Manchego Cheese", description: "Cheese made from sheep's milk" },
        { name: "Aceitunas", description: "Marinated olives" },
        { name: "Pan con Tomate", description: "Bread rubbed with tomato, olive oil, and garlic" },
      ],
      Dinner: [
        { name: "Tapas Assortment", description: "Variety of small dishes" },
        { name: "Fabada Asturiana", description: "Rich bean stew with pork and sausage" },
        { name: "Pulpo a la Gallega", description: "Galician-style octopus with paprika" },
        { name: "Cordero Asado", description: "Roast lamb" },
        { name: "Zarzuela", description: "Seafood stew in a flavorful sauce" },
      ],
      Dessert: [
        { name: "Flan", description: "Caramel custard" },
        { name: "Crema Catalana", description: "Catalan cream with caramelized sugar top" },
        { name: "Turrón", description: "Nougat made with almonds and honey" },
        { name: "Arroz con Leche", description: "Spanish rice pudding" },
        { name: "Churros con Chocolate", description: "Fried dough pastry served with thick hot chocolate" },
      ],
    },
    Turkish: {
      Breakfast: [
        {
          name: "Turkish Breakfast Platter",
          description: "Assortment of cheese, olives, tomatoes, cucumbers, eggs, and bread",
        },
        { name: "Menemen", description: "Scrambled eggs with tomatoes, peppers, and spices" },
        { name: "Simit", description: "Circular bread covered in sesame seeds" },
        { name: "Börek", description: "Layered pastry filled with cheese, meat, or vegetables" },
        { name: "Turkish Tea", description: "Strong black tea served in small glasses" },
      ],
      Lunch: [
        { name: "Döner Kebab", description: "Sliced meat cooked on a vertical rotisserie" },
        { name: "Pide", description: "Turkish flatbread topped with meat, cheese, or vegetables" },
        { name: "Mercimek Çorbası", description: "Red lentil soup" },
        { name: "Karnıyarık", description: "Stuffed eggplant with ground meat, tomatoes, and peppers" },
        { name: "Lahmacun", description: "Thin flatbread topped with minced meat and vegetables" },
      ],
      Snack: [
        { name: "Simit", description: "Circular bread covered in sesame seeds" },
        { name: "Kumpir", description: "Baked potato with various toppings" },
        { name: "Midye Dolma", description: "Stuffed mussels" },
        { name: "Çiğ Köfte", description: "Spicy vegetarian bulgur balls" },
        { name: "Ayran", description: "Savory yogurt drink" },
      ],
      Dinner: [
        { name: "İskender Kebab", description: "Sliced döner meat over pita with tomato sauce and yogurt" },
        { name: "Manti", description: "Turkish dumplings with yogurt sauce" },
        { name: "Imam Bayildi", description: "Stuffed eggplant in olive oil" },
        { name: "Kuzu Tandir", description: "Slow-cooked lamb" },
        { name: "Hünkar Beğendi", description: "Lamb stew served on eggplant puree" },
      ],
      Dessert: [
        { name: "Baklava", description: "Layered pastry filled with chopped nuts and sweetened with syrup" },
        { name: "Künefe", description: "Shredded pastry filled with cheese and soaked in sweet syrup" },
        { name: "Lokum (Turkish Delight)", description: "Gel-based confection" },
        { name: "Sütlaç", description: "Baked rice pudding" },
        { name: "Tavuk Göğsü", description: "Milk pudding made with chicken breast" },
      ],
    },
    Lebanese: {
      Breakfast: [
        { name: "Manakish", description: "Flatbread topped with zaatar, cheese, or ground meat" },
        { name: "Ful Medames", description: "Fava bean stew with olive oil, lemon juice, and garlic" },
        { name: "Labneh", description: "Strained yogurt served with olive oil and herbs" },
        { name: "Knefeh", description: "Sweet cheese pastry soaked in sugar syrup" },
        { name: "Lebanese Coffee", description: "Strong, unfiltered coffee often flavored with cardamom" },
      ],
      Lunch: [
        { name: "Shawarma", description: "Shaved meat wrapped in pita with vegetables and sauce" },
        { name: "Falafel", description: "Deep-fried chickpea balls served in pita" },
        { name: "Tabbouleh", description: "Parsley salad with bulgur, tomatoes, and mint" },
        { name: "Kibbeh", description: "Bulgur and minced meat croquettes" },
        { name: "Fattoush", description: "Bread salad with mixed greens and sumac" },
      ],
      Snack: [
        { name: "Hummus", description: "Chickpea dip with tahini and olive oil" },
        { name: "Baba Ganoush", description: "Eggplant dip with tahini and olive oil" },
        { name: "Sambousek", description: "Small meat or cheese-filled pastries" },
        { name: "Zaatar Bread", description: "Flatbread topped with zaatar spice mix" },
        { name: "Kaak", description: "Sesame bread rings" },
      ],
      Dinner: [
        { name: "Mezze Platter", description: "Assortment of small dishes" },
        { name: "Koussa Mahshi", description: "Stuffed zucchini with rice and meat" },
        { name: "Samke Harra", description: "Spicy fish with tahini sauce" },
        { name: "Shish Tawook", description: "Grilled chicken skewers" },
        { name: "Moujadara", description: "Lentils and rice with caramelized onions" },
      ],
      Dessert: [
        { name: "Baklava", description: "Layered phyllo pastry filled with nuts and soaked in syrup" },
        { name: "Maamoul", description: "Semolina cookies filled with dates or nuts" },
        { name: "Aish El Saraya", description: "Bread pudding topped with cream" },
        { name: "Halawet El Jibn", description: "Sweet cheese rolls" },
        { name: "Meghli", description: "Spiced rice pudding topped with nuts" },
      ],
    },
    Vietnamese: {
      Breakfast: [
        { name: "Pho", description: "Rice noodle soup with beef or chicken" },
        { name: "Banh Mi", description: "Vietnamese sandwich with various fillings" },
        { name: "Com Tam", description: "Broken rice with grilled pork and vegetables" },
        { name: "Xoi", description: "Sticky rice with various toppings" },
        { name: "Ca Phe Sua Da", description: "Iced coffee with sweetened condensed milk" },
      ],
      Lunch: [
        { name: "Bun Cha", description: "Grilled pork with rice noodles and herbs" },
        { name: "Goi Cuon", description: "Fresh spring rolls with shrimp or pork" },
        { name: "Banh Xeo", description: "Crispy savory pancake with pork and shrimp" },
        { name: "Bun Bo Hue", description: "Spicy beef noodle soup" },
        { name: "Com Ga", description: "Chicken rice" },
      ],
      Snack: [
        { name: "Banh Bao", description: "Steamed bun filled with pork and eggs" },
        { name: "Nem Ran", description: "Fried spring rolls" },
        { name: "Banh Cam", description: "Deep-fried sesame balls" },
        { name: "Tra Da", description: "Iced tea" },
        { name: "Banh Trang Nuong", description: "Grilled rice paper with various toppings" },
      ],
      Dinner: [
        { name: "Lau", description: "Vietnamese hot pot" },
        { name: "Ca Kho To", description: "Caramelized fish in clay pot" },
        { name: "Bo Luc Lac", description: "Shakingbeef" },
        { name: "Canh Chua", description: "Sweet and sour soup" },
        { name: "Cha Ca", description: "Turmeric fish with dill" },
      ],
      Dessert: [
        { name: "Che", description: "Sweet dessert soup" },
        { name: "Banh Flan", description: "Vietnamese crème caramel" },
        { name: "Sinh To", description: "Fresh fruit smoothie" },
        { name: "Banh Troi Nuoc", description: "Sweet rice balls in ginger syrup" },
        { name: "Sua Chua Nep Cam", description: "Yogurt with black sticky rice" },
      ],
    },
    Korean: {
      Breakfast: [
        { name: "Juk", description: "Rice porridge with various toppings" },
        { name: "Gyeran Jjim", description: "Steamed egg custard" },
        { name: "Kimchi Bokkeumbap", description: "Kimchi fried rice" },
        { name: "Seolleongtang", description: "Ox bone soup with rice" },
        { name: "Sikhye", description: "Sweet rice drink" },
      ],
      Lunch: [
        { name: "Bibimbap", description: "Mixed rice bowl with vegetables and meat" },
        { name: "Kimbap", description: "Korean-style sushi rolls" },
        { name: "Doenjang Jjigae", description: "Soybean paste stew" },
        { name: "Samgyeopsal", description: "Grilled pork belly" },
        { name: "Japchae", description: "Stir-fried glass noodles with vegetables" },
      ],
      Snack: [
        { name: "Tteokbokki", description: "Spicy rice cakes" },
        { name: "Odeng", description: "Fish cake skewers" },
        { name: "Hotteok", description: "Sweet filled pancakes" },
        { name: "Bungeoppang", description: "Fish-shaped pastry filled with red bean paste" },
        { name: "Gimbap", description: "Seaweed rice rolls" },
      ],
      Dinner: [
        { name: "Korean BBQ", description: "Assorted grilled meats" },
        { name: "Sundubu Jjigae", description: "Soft tofu stew" },
        { name: "Samgyetang", description: "Ginseng chicken soup" },
        { name: "Jjajangmyeon", description: "Noodles in black bean sauce" },
        { name: "Dakgalbi", description: "Spicy stir-fried chicken" },
      ],
      Dessert: [
        { name: "Bingsu", description: "Shaved ice dessert with various toppings" },
        { name: "Yakgwa", description: "Deep-fried honey cookies" },
        { name: "Songpyeon", description: "Half-moon shaped rice cakes" },
        { name: "Patbingsu", description: "Shaved ice with sweet red beans" },
        { name: "Gyeongdan", description: "Sweet rice balls coated in powder" },
      ],
    },
    // Add more cuisines here...
  }

  if (dishes[cuisine] && dishes[cuisine][mealType]) {
    const randomDish = dishes[cuisine][mealType][Math.floor(Math.random() * dishes[cuisine][mealType].length)]
    return { cuisine, dish: randomDish.name, description: randomDish.description }
  } else {
    // Fallback to generic dishes if the specific cuisine or meal type is not found
    const randomDish = genericDishes[mealType][Math.floor(Math.random() * genericDishes[mealType].length)]
    return { cuisine: "Generic", dish: randomDish.name, description: randomDish.description }
  }
}

export default function CuisineSelector() {
  const [selected, setSelected] = useState<string[]>([])
  const [mealPlan, setMealPlan] = useState<DailyMealPlan[]>([])

  const toggleCuisine = useCallback((cuisine: string) => {
    setSelected((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }, [])

  const handleGetRecommendation = useCallback(() => {
    const recommendation = getRecommendation(selected)
    toast.success(recommendation)
  }, [selected])

  const handleGenerateMealPlan = useCallback(() => {
    if (selected.length === 0) {
      toast.error("Please select at least one cuisine to generate a meal plan.")
      return
    }
    const newMealPlan = generateMealPlan(selected)
    setMealPlan(newMealPlan)
  }, [selected])

  return (
    <div className="min-h-screen bg-black p-6 pt-40">
      <h1 className="text-white text-3xl font-semibold mb-12 text-center">What are your favorite cuisines?</h1>
      <div className="max-w-[570px] mx-auto">
        <motion.div
          className="flex flex-wrap gap-3 overflow-visible mb-8"
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        >
          {cuisines.map((cuisine) => {
            const isSelected = selected.includes(cuisine)
            return (
              <motion.button
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                layout
                initial={false}
                animate={{
                  backgroundColor: isSelected ? "#2a1711" : "rgba(39, 39, 42, 0.5)",
                }}
                whileHover={{
                  backgroundColor: isSelected ? "#2a1711" : "rgba(39, 39, 42, 0.8)",
                }}
                whileTap={{
                  backgroundColor: isSelected ? "#1f1209" : "rgba(39, 39, 42, 0.9)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                  backgroundColor: { duration: 0.1 },
                }}
                className={`
                  inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${
                    isSelected
                      ? "text-[#ff9066] ring-[hsla(0,0%,100%,0.12)]"
                      : "text-zinc-400 ring-[hsla(0,0%,100%,0.06)]"
                  }
                `}
              >
                <motion.div
                  className="relative flex items-center"
                  animate={{
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.5rem" : "0",
                  }}
                  transition={{
                    ease: [0.175, 0.885, 0.32, 1.275],
                    duration: 0.3,
                  }}
                >
                  <span>{cuisine}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 0.5,
                        }}
                        className="absolute right-0"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#ff9066] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#2a1711]" strokeWidth={1.5} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
        <div className="flex justify-center mt-8 space-x-4">
          <Button onClick={handleGetRecommendation} className="bg-[#ff9066] text-[#2a1711] hover:bg-[#ff7c4d]">
            Get Recommendation
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleGenerateMealPlan} className="bg-[#ff9066] text-[#2a1711] hover:bg-[#ff7c4d]">
                Generate Meal Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2a1711] text-[#ff9066] max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Your Weekly Meal Plan</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {mealPlan.map((day, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{day.day}</h3>
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="mb-2">
                        <strong>
                          {meal.time} - {meal.type}:
                        </strong>{" "}
                        {meal.dish} ({meal.cuisine})<p className="text-sm text-gray-400">{meal.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}