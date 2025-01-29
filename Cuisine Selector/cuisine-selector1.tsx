"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

  // Ensure we don't recommend a fusion of the same cuisine
  while (randomCuisine2 === randomCuisine1 && selectedCuisines.length > 1) {
    randomCuisine2 = selectedCuisines[Math.floor(Math.random() * selectedCuisines.length)]
  }

  return `How about trying a fusion of ${randomCuisine1} and ${randomCuisine2} cuisines?`
}

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function CuisineSelector() {
  const [selected, setSelected] = useState<string[]>([])

  const toggleCuisine = useCallback((cuisine: string) => {
    setSelected((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }, [])

  const handleGetRecommendation = useCallback(() => {
    const recommendation = getRecommendation(selected)
    toast.success(recommendation)
  }, [selected])

  return (
    <div className="min-h-screen bg-black p-6 pt-40">
      <h1 className="text-white text-3xl font-semibold mb-12 text-center">What are your favorite cuisines?</h1>
      <div className="max-w-[570px] mx-auto">
        <motion.div className="flex flex-wrap gap-3 overflow-visible mb-8" layout transition={transitionProps}>
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
        <div className="flex justify-center mt-8">
          <Button onClick={handleGetRecommendation} className="bg-[#ff9066] text-[#2a1711] hover:bg-[#ff7c4d]">
            Get Recommendation
          </Button>
        </div>
      </div>
    </div>
  )
}

