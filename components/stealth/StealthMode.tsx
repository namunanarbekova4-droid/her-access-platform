"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StealthModeProps {
  onExit: () => void;
}

const recipes = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    emoji: "🍕",
    time: "45 min",
    difficulty: "Easy",
    description:
      "A timeless Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy crust.",
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Basil leaves",
      "Olive oil",
    ],
    steps: [
      "Preheat oven to 500°F (260°C)",
      "Stretch dough into a 12-inch circle",
      "Spread tomato sauce evenly",
      "Add torn mozzarella pieces",
      "Bake 10-12 minutes until golden",
      "Top with fresh basil and a drizzle of olive oil",
    ],
  },
  {
    id: 2,
    name: "Creamy Mushroom Risotto",
    emoji: "🍄",
    time: "35 min",
    difficulty: "Medium",
    description:
      "A rich, velvety Italian rice dish with earthy mushrooms and Parmesan cheese.",
    ingredients: [
      "Arborio rice",
      "Mixed mushrooms",
      "Vegetable broth",
      "Parmesan",
      "White wine",
      "Onion",
    ],
    steps: [
      "Sauté onion in butter until soft",
      "Add mushrooms and cook 5 minutes",
      "Toast rice 2 minutes",
      "Add wine and stir until absorbed",
      "Add warm broth ladle by ladle",
      "Finish with Parmesan and black pepper",
    ],
  },
  {
    id: 3,
    name: "Lemon Blueberry Muffins",
    emoji: "🫐",
    time: "30 min",
    difficulty: "Easy",
    description:
      "Light, fluffy muffins bursting with fresh blueberries and bright lemon zest.",
    ingredients: [
      "Flour",
      "Blueberries",
      "Lemon zest",
      "Eggs",
      "Butter",
      "Vanilla",
      "Baking powder",
    ],
    steps: [
      "Preheat oven to 375°F (190°C)",
      "Mix dry ingredients in one bowl",
      "Whisk wet ingredients separately",
      "Fold together gently",
      "Fold in blueberries last",
      "Bake 20-22 minutes until golden",
    ],
  },
  {
    id: 4,
    name: "Thai Green Curry",
    emoji: "🥘",
    time: "25 min",
    difficulty: "Easy",
    description:
      "Aromatic and creamy Thai curry with vegetables and coconut milk.",
    ingredients: [
      "Green curry paste",
      "Coconut milk",
      "Mixed vegetables",
      "Jasmine rice",
      "Lime",
      "Fish sauce",
    ],
    steps: [
      "Heat oil in a wok",
      "Fry curry paste 1 minute",
      "Pour in coconut milk",
      "Add vegetables and simmer 10 min",
      "Season with fish sauce and lime",
      "Serve over jasmine rice",
    ],
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    emoji: "🍫",
    time: "20 min",
    difficulty: "Medium",
    description:
      "Decadent individual chocolate cakes with a warm molten center.",
    ingredients: [
      "Dark chocolate",
      "Butter",
      "Eggs",
      "Sugar",
      "Flour",
      "Vanilla extract",
    ],
    steps: [
      "Melt chocolate and butter together",
      "Whisk in eggs and sugar",
      "Fold in flour gently",
      "Pour into greased ramekins",
      "Refrigerate 30 minutes",
      "Bake 12 minutes at 425°F",
    ],
  },
];

export function StealthMode({ onExit }: StealthModeProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<
    (typeof recipes)[0] | null
  >(null);
  const [showExitHint, setShowExitHint] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "H") {
        onExit();
      }
      if (e.key === "Escape" && selectedRecipe) {
        setSelectedRecipe(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit, selectedRecipe]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-orange-50 overflow-y-auto"
      >
        {/* Cooking Site Header */}
        <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👩‍🍳</span>
              <span className="text-xl font-bold text-orange-700">
                RecipeNook
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-orange-600">Recipes</span>
              <span className="cursor-pointer hover:text-orange-600">Tutorials</span>
              <span className="cursor-pointer hover:text-orange-600">Tips</span>
              <span className="cursor-pointer hover:text-orange-600">Community</span>
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm">
                👤
              </div>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-10 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">
              Discover Delicious Recipes
            </h1>
            <p className="text-orange-100">
              From quick weeknight dinners to weekend baking adventures
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {[
              "🍕 Italian",
              "🍜 Asian",
              "🥗 Healthy",
              "🍰 Desserts",
              "🥘 One-Pot",
              "🥦 Vegetarian",
            ].map((cat) => (
              <span
                key={cat}
                className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-orange-100 hover:bg-orange-50 cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Featured Recipes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="h-40 bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center text-6xl">
                  {recipe.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{recipe.time}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{recipe.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-orange-100">
            <h3 className="font-bold text-gray-800 mb-4">
              🌟 Cooking Tips of the Day
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Always read the full recipe before starting to cook</li>
              <li>• Mise en place — prep all ingredients before you begin</li>
              <li>• Let meat rest before cutting to keep it juicy</li>
              <li>• Season pasta water generously with salt</li>
            </ul>
          </div>
        </div>

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black/50 z-10 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center text-5xl mb-3">
                {selectedRecipe.emoji}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {selectedRecipe.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedRecipe.description}
              </p>

              <h3 className="font-semibold text-gray-700 mb-2">Ingredients</h3>
              <ul className="space-y-1 mb-4">
                {selectedRecipe.ingredients.map((ing) => (
                  <li key={ing} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-orange-400">•</span> {ing}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-gray-700 mb-2">Steps</h3>
              <ol className="space-y-2">
                {selectedRecipe.steps.map((step, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex gap-3"
                  >
                    <span className="font-bold text-orange-500 flex-shrink-0">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Hidden Exit */}
        <div className="fixed bottom-4 right-4">
          <button
            onMouseEnter={() => setShowExitHint(true)}
            onMouseLeave={() => setShowExitHint(false)}
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-orange-100 opacity-30 hover:opacity-60 transition-opacity"
            aria-label="Exit safe mode"
          />
          {showExitHint && (
            <div className="absolute bottom-10 right-0 bg-white text-xs text-gray-500 px-3 py-1.5 rounded-xl shadow border whitespace-nowrap">
              Ctrl+Shift+H to exit
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
