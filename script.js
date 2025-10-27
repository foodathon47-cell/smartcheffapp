let model;

// Load MobileNet model
(async function() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading AI model... ⏳</p>";
  model = await mobilenet.load();
  resultsDiv.innerHTML = "<p>AI Model loaded ✅</p>";
})();

// Button click event
document.getElementById("generateBtn").addEventListener("click", async () => {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Processing ingredients... 🍽️</p>";

  let ingredients = [];

  // 1️⃣ Image scanning
  const imageInput = document.getElementById("imageInput");
  if (imageInput.files.length > 0 && model) {
    const file = imageInput.files[0];
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.width = 224;
    img.height = 224;
    img.onload = async () => {
      const predictions = await model.classify(img);
      ingredients = predictions.slice(0, 5).map(p => p.className.toLowerCase());
      
      // Merge with manual input
      const manual = document.getElementById("manualInput").value
                        .toLowerCase()
                        .split(",")
                        .map(i => i.trim())
                        .filter(i => i);
      ingredients = Array.from(new Set([...ingredients, ...manual]));

      generateRecipes(ingredients);
    };
  } else {
    // 2️⃣ Only manual input
    ingredients = document.getElementById("manualInput").value
                    .toLowerCase()
                    .split(",")
                    .map(i => i.trim())
                    .filter(i => i);
    generateRecipes(ingredients);
  }
});

// Tiny JS AI recipe generator
function generateRecipes(ingredients) {
  const resultsDiv = document.getElementById("results");
  if (ingredients.length === 0) {
    resultsDiv.innerHTML = "<p>No ingredients provided.</p>";
    return;
  }

  resultsDiv.innerHTML = `<h3>Detected Ingredients:</h3><p>${ingredients.join(", ")}</p>`;

  // Generate 3 recipes
  for (let i = 0; i < 3; i++) {
    const numIngredients = Math.min(ingredients.length, Math.floor(Math.random()*ingredients.length)+1);
    const recipeIngredients = shuffleArray(ingredients).slice(0, numIngredients);

    const recipeName = capitalizeFirstLetter(recipeIngredients[0]) + " " + randomDishType();

    let instructions = "";
    recipeIngredients.forEach((ing, idx) => {
      instructions += `${idx+1}. Prepare ${ing} by washing/chopping.\n`;
    });
    instructions += `${recipeIngredients.length+1}. Cook everything together on medium heat for 10-15 minutes.\n`;
    instructions += `${recipeIngredients.length+2}. Add spices and seasoning to taste.\n`;
    instructions += `${recipeIngredients.length+3}. Serve hot and enjoy your ${recipeName}!\n`;

    const healthyIngredients = ["lettuce","broccoli","carrot","spinach","fish","chicken","tomato"];
    const unhealthyIngredients = ["chocolate","cake","sugar","bacon","butter"];
    let score = 3;
    recipeIngredients.forEach(ing => {
      if (healthyIngredients.includes(ing)) score++;
      if (unhealthyIngredients.includes(ing)) score--;
    });
    score = Math.max(1, Math.min(5, score));

    resultsDiv.innerHTML += `
      <div class="recipe-card">
        <h4>${recipeName}</h4>
        <p><b>Ingredients:</b> ${recipeIngredients.join(", ")}</p>
        <pre>${instructions}</pre>
        <p><b>Health rating:</b> ${score}/5</p>
      </div>
    `;
  }
}

// Helper functions
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function randomDishType() {
  const types = ["Delight","Surprise","Mix","Special","Casserole","Stew","Bake"];
  return types[Math.floor(Math.random()*types.length)];
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
