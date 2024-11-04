def intro():
    print("\nWelcome to the Adventure!")
    print("You are a brave adventurer in a magical kingdom. Strange events have been occurring, and it's up to you to uncover the mystery.")
    print("Your journey begins now...\n")
    input("Press Enter to begin...\n")
    crossroads()

def crossroads():
    print("You find yourself standing at a crossroads in a dense forest.")
    print("To the left, the path leads into a dark cave.")
    print("To the right, the path leads to a river with a small boat.")
    print("Straight ahead, you see a castle in the distance.\n")

    choice = input("Do you want to go left to the cave, right to the river, or straight to the castle? (left/right/straight): ").lower()

    if choice == "left":
        cave()
    elif choice == "right":
        river()
    elif choice == "straight":
        castle()
    else:
        print("\nInvalid choice. Try again.\n")
        crossroads()

def cave():
    print("\nYou venture into the dark cave.")
    print("Inside, the air is cold, and you hear the distant growl of a creature.")
    print("You see a glimmer of treasure deeper inside, but the growls grow louder.\n")

    choice = input("Do you continue deeper into the cave, or retreat back to the crossroads? (continue/retreat): ").lower()

    if choice == "continue":
        print("\nYou move forward bravely, but a massive dragon emerges from the shadows!")
        print("It breathes fire, and though you fight valiantly, you are no match for the beast.")
        print("Your adventure ends here, but your bravery will be remembered.")
        game_over()
    elif choice == "retreat":
        print("\nYou decide it's wiser to avoid the danger for now and return to the crossroads.\n")
        crossroads()
    else:
        print("\nInvalid choice. Try again.\n")
        cave()

def river():
    print("\nYou approach the river. The boat is small and looks rickety, but it could carry you across.")
    print("The current is strong, and you hear the sound of something moving in the water.\n")

    choice = input("Do you take the boat across the river or follow the riverbank instead? (boat/follow): ").lower()

    if choice == "boat":
        print("\nYou step into the boat and start rowing. Halfway across, a massive sea serpent rises from the depths!")
        print("You try to fend it off, but the boat is capsized, and you are pulled into the deep.")
        print("Your adventure ends here in the watery abyss.")
        game_over()
    elif choice == "follow":
        print("\nYou decide it's safer to follow the riverbank.")
        print("After a while, you discover a hidden bridge guarded by a mysterious figure.\n")
        bridge_guard()
    else:
        print("\nInvalid choice. Try again.\n")
        river()

def bridge_guard():
    print("The figure blocking the bridge is a hooded sorcerer.")
    print("He offers you a choice: answer his riddle correctly and you may pass, or refuse and be turned to stone.\n")

    choice = input("Do you accept the riddle or refuse? (accept/refuse): ").lower()

    if choice == "accept":
        riddle()
    elif choice == "refuse":
        print("\nThe sorcerer mutters a spell, and you feel your body turning to stone.")
        print("You can no longer move, and your adventure ends here as a statue.")
        game_over()
    else:
        print("\nInvalid choice. Try again.\n")
        bridge_guard()

def riddle():
    print("\nThe sorcerer asks you: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?'")
    
    answer = input("Your answer: ").lower()

    if answer == "echo":
        print("\nThe sorcerer nods approvingly. 'You are wise,' he says, allowing you to cross the bridge.")
        print("On the other side, you find a path leading to the castle.\n")
        castle()
    else:
        print("\n'Wrong answer,' the sorcerer says, and with a wave of his hand, you are turned to stone.")
        game_over()

def castle():
    print("\nYou arrive at the gates of the castle.")
    print("The guards look at you warily, but they recognize you as a hero.")
    print("They open the gates, and you are welcomed into the grand hall, where the king awaits.\n")

    choice = input("Do you approach the king or explore the castle first? (approach/explore): ").lower()

    if choice == "approach":
        king()
    elif choice == "explore":
        print("\nYou decide to explore the castle first.")
        print("As you wander through the halls, you accidentally stumble into a hidden trapdoor and fall into the dungeons!")
        print("In the darkness, you hear ominous footsteps approaching. Your adventure ends here.")
        game_over()
    else:
        print("\nInvalid choice. Try again.\n")
        castle()

def king():
    print("\nYou approach the king, who stands beside a golden throne.")
    print("'Brave adventurer,' he says, 'I have been waiting for you. The kingdom is in grave danger.'")
    print("'A dark force stirs in the lands beyond, and only a hero like you can stop it.'")
    print("\nThe king offers you a final choice.\n")

    choice = input("Do you accept the king's quest or decline and retire from adventuring? (accept/decline): ").lower()

    if choice == "accept":
        print("\nYou accept the king's quest and are hailed as the kingdom's champion.")
        print("Your adventure continues as you set off to face even greater challenges!")
        print("Congratulations, you have completed the first chapter of your adventure!")
        game_over(win=True)
    elif choice == "decline":
        print("\nYou decide to retire from adventuring.")
        print("Though the kingdom remains in danger, you live a peaceful life, your name fading into legend.")
        game_over()
    else:
        print("\nInvalid choice. Try again.\n")
        king()

def game_over(win=False):
    if win:
        print("\nYou have completed the adventure. Well done!")
    else:
        print("\nGame Over. Thanks for playing!")
    play_again()

def play_again():
    choice = input("\nDo you want to play again? (yes/no): ").lower()
    if choice == "yes":
        intro()
    else:
        print("Goodbye, adventurer!")

# Start the adventure
if __name__ == "__main__":
    intro()
