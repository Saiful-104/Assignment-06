// script


const categoryContainer = document.getElementById('category-container');
const plantContainer = document.getElementById('plant-container');

// render plant cards
function renderPlants(plants) {
  plantContainer.innerHTML = '';
  if (plants.length === 0) {
    plantContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No plants found.</p>';
    return;
  }

  plants.forEach(plant => {
    const img = plant.image;
    const name = plant.name;
    const desc = plant.description;
    const cat = plant.category;
    const price = plant.price;

    const card = document.createElement('div');
    card.className = "w-full bg-white p-3 rounded-lg shadow-md";

    card.innerHTML = `
      <img class="w-full h-44 object-cover rounded-t-lg" src="${img}" alt="${name}">
      <div class="p-1">
        <h3 class="font-bold text-lg mt-2">${name}</h3>
        <p class="text-gray-500 text-sm mt-2">${desc}</p>
        <div class="mt-3 flex justify-between items-center">
          <h3 class="text-green-600 bg-green-100 p-1 text-sm rounded-full">${cat}</h3>
          <h2 class="font-bold text-xl"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${price}</h2>
        </div>
        <button class="mt-3 w-full text-center text-white bg-green-800 px-5 py-2 text-base rounded-full font-semibold hover:bg-yellow-300 hover:text-green-900 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    `;
    plantContainer.appendChild(card);
  });
}

// load all plants
function loadAllPlants() {
  plantContainer.innerHTML = '<p class="p-4 text-center">Loading...</p>';
  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => res.json())
    .then(data => {
      const plants = data.plants ;
      renderPlants(plants);
    });
}

// load plants by category id
function loadCategory(id) {
  plantContainer.innerHTML = '<p class="p-4 text-center">Loading...</p>';
  fetch(`https://openapi.programming-hero.com/api/category/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(json => {
      const plants = json.plants ;
      renderPlants(plants);
    });
}

// load categories and attach click handlers
function loadCategories() {
  fetch('https://openapi.programming-hero.com/api/categories')
    .then(res => res.json())
    .then(json => {
      categoryContainer.innerHTML = '';

      // "All Trees" option
      const allLi = document.createElement('li');
      allLi.textContent = 'All Trees';
      allLi.dataset.id = 'all';
      allLi.className = "hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200";
      categoryContainer.appendChild(allLi);

      const cats = json.categories ;
      cats.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.category_name;
        li.dataset.id = cat.id; // numeric id
        li.className = "hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200";
        categoryContainer.appendChild(li);
      });

      // set first active
      if (categoryContainer.firstElementChild) {
        categoryContainer.firstElementChild.classList.add('bg-green-500','text-white');
      }

      // load all plants initially
      loadAllPlants();
    });

  // delegate click
  categoryContainer.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    // active class
    [...categoryContainer.children].forEach(x => x.classList.remove('bg-green-500','text-white'));
    li.classList.add('bg-green-500','text-white');

    const id = li.dataset.id;
    if (!id || id === 'all') loadAllPlants();
    else loadCategory(id);
  });
}

// start
loadCategories();
