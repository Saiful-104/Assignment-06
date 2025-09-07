const categori = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then(json => {
            const container = document.getElementById('category-container');
            container.innerHTML = ''; // আগের content clear

            // forEach ব্যবহার করে innerHTML যোগ করা
        json.categories.forEach(cat => {
    container.innerHTML += `
        <li class=" hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200">
            ${cat.category_name}
        </li>`;
});

        });
}

// Load categories dynamically
categori();



// card load all
  const container = document.getElementById("plant-container");

fetch("https://openapi.programming-hero.com/api/plants")
  .then(res => res.json())
  .then(data => 
    data.plants.forEach(plant => {
      const card = document.createElement("div");
      card.className = " w-60 bg-white p-3 rounded-lg shadow-md";

      card.innerHTML = `
        <img class="w-full h-44 object-cover rounded-t-lg" src="${plant.image}" alt="${plant.name}">
        <div class="p-1">
          <h3 class="font-bold text-lg mt-2">${plant.name}</h3>
          <p class="text-gray-500 text-sm mt-2">${plant.description}</p>
          <div class="mt-3 flex justify-between items-center">
            <h3 class="text-green-600 bg-green-100 p-1 text-sm rounded-full">${plant.category}</h3>
            <h2 class="font-bold text-xl"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</h2>
          </div>
          <button class="mt-3 w-full text-center text-white bg-green-800 px-5 py-2 text-base rounded-full font-semibold hover:bg-yellow-300 hover:text-green-900 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      `;

      container.appendChild(card);
    })
  );