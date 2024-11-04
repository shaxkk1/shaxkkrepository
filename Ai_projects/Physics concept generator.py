import random

# List of physics concepts
physics_concepts = [
    "Newton's First Law of Motion",
    "Newton's Second Law of Motion",
    "Newton's Third Law of Motion",
    "Law of Universal Gravitation",
    "Kinetic Energy",
    "Potential Energy",
    "Conservation of Energy",
    "Work-Energy Theorem",
    "Centripetal Force",
    "Coulomb's Law",
    "Ohm's Law",
    "Magnetic Fields",
    "Faraday's Law of Induction",
    "Thermodynamics - First Law",
    "Thermodynamics - Second Law",
    "Entropy",
    "Relativity - Time Dilation",
    "Relativity - Mass-Energy Equivalence",
    "Quantum Mechanics - Uncertainty Principle",
    "Quantum Mechanics - Wave-Particle Duality",
    "Schrödinger's Equation",
    "Electromagnetic Spectrum",
    "Wave-Particle Duality",
    "Photoelectric Effect",
    "Special Relativity",
    "General Relativity",
    "Black Holes",
    "String Theory",
    "Dark Matter",
    "Dark Energy",
    "Friction",
    "Projectile Motion",
    "Harmonic Oscillator",
    "Electromagnetic Induction",
    "Pascal's Principle",
    "Archimedes' Principle",
    "Bernoulli's Principle",
    "Higgs Boson",
    "Double-Slit Experiment",
    "Thermal Expansion",
    "Electric Potential Energy",
    "Conservation of Momentum",
    "Superconductivity",
    "Heisenberg Uncertainty Principle",
    "Quantum Entanglement"
]

# Function to randomly generate a physics concept
def generate_physics_concept():
    concept = random.choice(physics_concepts)
    print(f"Physics Concept: {concept}")

# Run the concept generator
if __name__ == "__main__":
    while True:
        generate_physics_concept()
        another = input("Do you want to generate another concept? (yes/no): ").lower()
        if another != 'yes':
            break
    print("Goodbye!")
