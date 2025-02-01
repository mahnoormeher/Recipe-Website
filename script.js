let searchBtn=document.getElementById("search")
let searchBox=document.getElementById("searchbox")
let recipeContainer=document.querySelector(".recipe-container")
let recipeDetails=document.querySelector(".recipe-details")
let closeBtn=document.querySelector(".close-btn")

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent the default anchor behavior
      const targetId = this.getAttribute('href').substring(1); // Get the target section's id
      const targetSection = document.getElementById(targetId);
  
      // Scroll to the target section with smooth behavior
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  


const fetchRecipe=async(rec)=>{
 try{
 
const data=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${rec}`)
const response=await data.json();

if (!response.meals) {
  recipeContainer.innerHTML = "<p>No recipes found! Try a different search.</p>";
  return;
}

response.meals.forEach(meal => {
   const recipeDiv=document.createElement("div")
   recipeDiv.classList.add("recipe") 
   recipeDiv.innerHTML=`
   <img src="${meal.strMealThumb}">
   <h3>${meal.strMeal}</h3>
   <p><span>${meal.strArea}</span> Dish</p>
   <p>Belongs to <span>${meal.strCategory}</span> Category</p>
    `
    const button=document.createElement("button")
    button.classList.add("recipe-btn")
    button.textContent="View Recipe"

   recipeDiv.appendChild(button);
   button.addEventListener("click",()=>{
    openRecipePopup(meal)
   })
   recipeContainer.appendChild(recipeDiv);
});}catch(error){
  console.error("Error fetching recipe:", error);
  recipeContainer.innerHTML = "<p>Something went wrong! Please try again.</p>";
}


}
const fetchIngredients=(meal)=>{
  let ingredientsList="";
  for(let i=1;i<=20;i++){
    const ingredient=meal[`strIngredient${i}`];
    if(ingredient){
      const measure=meal[`strMeasure${i}`]
ingredientsList+=`<li>${measure} ${ingredient}</li>`
    }else{
      break;
    }
  }
  return ingredientsList;
}

const openRecipePopup=(meal)=>{
recipeDetails.innerHTML=`
    <h2 class="recipeName">${meal.strMeal || meal.name}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">
      ${fetchIngredients(meal)}
    </ul>
    <h3>Instructions:</h3>
    <p class="recipeInstructions">${meal.strInstructions || "Instructions not available."}</p>
  `;
recipeDetails.parentElement.style.display="flex";
}
closeBtn.addEventListener("click",()=>{
  recipeDetails.parentElement.style.display="none";
})

searchBtn.addEventListener("click",()=>{
  const searchInput = searchBox.value.trim();
  recipeContainer.innerHTML = ""; // Clear existing recipes before new search

  if (!searchInput) {
    displayRecipes(recipes); // Show default recipes when search is empty
    return;
  }

  fetchRecipe(searchInput); // Fetch new recipes
})


const categoryData = {
  "Breakfast": {
    description: "Start your morning right with our collection of delicious and nutritious breakfast recipes! From classic pancakes and omelets to healthy smoothie bowls and overnight oats, we have something for every taste.",
    image: "images/breakfast.jpeg",
    cookingTime: "10-30 min",
    difficulty: "Easy",
    recipes: ["Pancakes", "Omelette", "Smoothie Bowl"]
  },
  "Vegetarian": {
    description: "Explore a variety of vibrant and flavorful vegetarian dishes that are both healthy and satisfying. From fresh salads and hearty soups to protein-packed plant-based meals, our vegetarian recipes offer something delicious for every occasion.",
  
    image: "images/lunch.jpg",
    cookingTime: "20-45 min",
    difficulty: "Medium",
    recipes: ["Vegetable Stir-Fry", "Chickpea Salad", "Stuffed Peppers"]
  },
  "Chicken": {
    description: "Juicy, flavorful, and easy to prepare—our chicken recipes are perfect for any meal! From crispy fried chicken to creamy butter chicken and healthy grilled options, we have a variety of dishes to satisfy your cravings. ",
    image: "images/dinner.jpg",
    cookingTime: "30-60 min",
    difficulty: "Medium",
    recipes: ["Grilled Chicken", "Chicken Curry", "Chicken Alfredo"]
  },
  "Sea Food": {
    description: "Dive into the rich flavors of the ocean with our seafood recipes! From buttery garlic shrimp and crispy fish tacos to elegant salmon dishes, there's something for every seafood lover.",
    image: "images/seafood.jpg",
    cookingTime: "15-40 min",
    difficulty: "Hard",
    recipes: ["Grilled Salmon", "Shrimp Pasta", "Fish Tacos"]
  },
  "Deserts": {
    description: "Indulge your sweet tooth with our delightful dessert recipes! From rich chocolate cakes and creamy cheesecakes to fruity pies and classic cookies, we have desserts for every occasion",
    image: "images/desert.jpg",
    cookingTime: "20-50 min",
    difficulty: "Easy",
    recipes: ["Chocolate Cake", "Mango Pudding", "Brownies"]
  }
};

const openCategoryPopup = (categoryName) => {
  const popup = document.getElementById("categoryPopup");
  const title = document.getElementById("popupTitle");
  const desc = document.getElementById("popupDescription");
  const image = document.getElementById("popupImage");
  const cookingTime = document.getElementById("popupCookingTime");
  const difficulty = document.getElementById("popupDifficulty");
  const recipesList = document.getElementById("popupRecipes");
 // const viewAllBtn = document.getElementById("viewAllBtn");

  // Get category data
  const category = categoryData[categoryName];

  // Update popup content dynamically
  title.textContent = categoryName;
  desc.textContent = category.description;
  image.src = category.image;
  cookingTime.textContent = category.cookingTime;
  difficulty.textContent = category.difficulty;

  // Populate recipes list
  recipesList.innerHTML = "";
  category.recipes.forEach(recipe => {
    const li = document.createElement("li");
    li.textContent = recipe;
    recipesList.appendChild(li);
  });

  // Set view all button link (if you have a recipes page)
  //viewAllBtn.onclick = () => {
    //alert(`Redirecting to ${categoryName} recipes page!`);
    // window.location.href = `/recipes?category=${categoryName.toLowerCase()}`;
 // };

  // Show popup
  popup.style.display = "flex";
};

// Close popup function
const closePopup = () => {
  document.getElementById("categoryPopup").style.display = "none";
};

// Add event listeners to all "View More" buttons
document.querySelectorAll(".view-category-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const categoryCard = event.target.closest(".category-card");
    const categoryName = categoryCard.querySelector(".category-name").textContent;
    
    openCategoryPopup(categoryName);
  });
});
document.getElementById("search").addEventListener("click", function () {
  const searchQuery = document.getElementById("searchbox").value.trim().toLowerCase();
  const recipesSection = document.getElementById("recipes");

  if (searchQuery !== "") {
    setTimeout(() => {
      const recipesPosition = recipesSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: recipesPosition - 50, behavior: "smooth" }); // Adjust -50 if needed
    }, 1000); 
  }
});
const recipes = [
  {
    name: "Pizza Express Margherita",
    description: "Classic Italian pizza with fresh basil and mozzarella.",
    image: "images/pizza.jpg",
  },
 
  {
    name: "Greek Salad",
    description: "Fresh veggies, olives, and feta cheese with olive oil.",
    image: "images/salad.jpg",
  },
  {
    name: "Spaghetti Bolognese",
    description: "Rich tomato sauce with minced meat over pasta.",
    image: "images/spaghetti.jpeg",
  },
  {
    name: "Chocolate Cake",
    description: "Moist and delicious chocolate treat with frosting.",
    image: "images/cake.jpg",
  },
  {
    name: "Chicken Handi",
    description: "Perfectly marinated, tender & juicy chicken.",
    image: "images/Chicken.jpeg",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const recipeContainer = document.querySelector(".recipe-container");
  const searchInput = document.getElementById("searchbox");
  const searchButton = document.getElementById("search");
  const recipeHeading = document.getElementById("recipe-heading");

  displayRecipes(recipes);
  

  
// Function to display recipes
function displayRecipes(filteredRecipes, isSearch = false) {
  recipeContainer.innerHTML = ""; // Clear previous content

  if (filteredRecipes.length === 0) {
    recipeContainer.innerHTML = "<p>No recipes found! Try a different search.</p>";
    return;
  }

  filteredRecipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
      <h3 class="recipe-name">${recipe.name}</h3>
      <p class="recipe-description">${recipe.description}</p>
    `;

    const button = document.createElement("button");
    button.classList.add("recipe-btn");
    button.textContent = "View Recipe";

    recipeCard.appendChild(button);

    // **NEW: Fetch full details before opening popup**
    button.addEventListener("click", async () => {
      
        try {
          let recipeName = recipe.name; // Use the exact recipe name
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
          const data = await response.json();
      
          if (data.meals && data.meals.length > 0) {
            openRecipePopup(data.meals[0]); // Pass the actual meal object
          } else {
            alert("Recipe details not found. Try searching manually!");
          }
        } catch (error) {
          console.error("Error fetching full recipe details:", error);
        }
      
    });

    recipeContainer.appendChild(recipeCard);
  });

  // Change heading dynamically
  recipeHeading.textContent = isSearch ? "Delicious Recipes" : "Popular Recipes";
}


// Show default recipes on page load
displayRecipes(recipes);

// Search functionality
searchButton.addEventListener("click", function () {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    displayRecipes(recipes); // Show default recipes if search is empty
    return;
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm)
  );

  displayRecipes(filteredRecipes, true); // Pass "true" to indicate a search

  // Smooth scroll to recipes section
  document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
});
});
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevents page reload

      // Get form values
      const fullName = contactForm.querySelector("input[type='text']").value.trim();
      const email = contactForm.querySelector("input[type='email']").value.trim();
      const message = contactForm.querySelector("textarea").value.trim();

      // Basic Validation
      if (fullName === "" || email === "" || message === "") {
          alert("Please fill out all fields!");
          return;
      }

    
      

      // Simulate form submission (Replace this with actual backend integration)
      console.log("Full Name:", fullName);
      console.log("Email:", email);
      console.log("Message:", message);

      // Show success message
      alert("Thank you! Your message has been sent successfully.");

      // Clear form fields
      contactForm.reset();
  });


});


document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  scrollToTopBtn.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  });
});
