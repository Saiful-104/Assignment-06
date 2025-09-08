const categoryContainer = document.getElementById('category-container');
const plantContainer = document.getElementById('plant-container');
const cartContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
let cart = []; 

// render plant cards 
function renderPlants(plants) {
  plantContainer.innerHTML = '';

  if ( plants.length === 0) {
    plantContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No plants found.</p>';
    return;
  }

  plants.forEach(plant => {
    const img = plant.image ;
    const name = plant.name ;
    let desc = plant.description ;
    const cat = plant.category ;
    const price = plant.price;
    const pid = plant.id ;

    if (desc.length > 80) desc = desc.substring(0, 80) + '...';

    const card = document.createElement('div');
    card.className = "w-full h-[420px] bg-white p-3 rounded-lg shadow-md flex flex-col";

    
    const safePidAttr = `data-id="${pid}"`;


    card.innerHTML = `
      <img class="w-full h-44 object-cover rounded-t-lg" src="${img}" alt="${name}">
      <div class="p-1 flex-1 flex flex-col">
        <h3 class="font-bold text-lg mt-2 cursor-pointer text-green-800" ${safePidAttr}>${name}</h3>
        <p class="text-gray-500 text-sm mt-2 flex-1">${desc}</p>
        <div class="mt-3 flex justify-between items-center">
          <h3 class="text-green-600 bg-green-100 p-1 text-sm rounded-full">${cat}</h3>
          <h2 class="font-bold text-xl"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${price}</h2>
        </div>
        <button class="mt-3 w-full text-center text-white bg-green-800 px-5 py-2 text-base rounded-full font-semibold hover:bg-yellow-300 hover:text-green-900 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    `;

    const addToCartBtn = card.querySelector('button');
    addToCartBtn.addEventListener('click', () => {
      const existing = cart.find(item => item.id === pid);
      if (existing) existing.quantity += 1;
      else cart.push({ id: pid, name, price, quantity: 1 });
      updateCartUI();
    });

    plantContainer.appendChild(card);
  });
}

//Update Cart UI 
function updateCartUI() {
  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-green-50 p-2 gap-2 rounded';
    div.innerHTML = `
      <div>
        <h4 class="font-bold">${item.name}</h4>
        <p class="text-gray-500"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${item.price} <span>x ${item.quantity}</span></p>
      </div>
      <div>
        <i class="fa-solid fa-x text-gray-400 cursor-pointer remove-cart-item"></i>
      </div>
    `;

    div.querySelector('.remove-cart-item').addEventListener('click', () => {
      cart = cart.filter(x => x.id !== item.id);
      updateCartUI();
    });

    cartContainer.appendChild(div);
  });

  cartTotalEl.innerHTML = `<i class="fa-solid fa-bangladeshi-taka-sign"></i> <span class="font-semibold">${total}</span>  `;
}

//Normalize API response 
function normalizePlantsResponse(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.plants && Array.isArray(data.plants)) return data.plants;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.plants && typeof data.plants === 'object') return [data.plants];
  if (data.data && typeof data.data === 'object') return [data.data];
  return [];
}

// Load all plants 
function loadAllPlants() {
  plantContainer.innerHTML = `
    <div class="col-span-full flex justify-center mb-4">
      <div class="flex space-x-2">
        <span class="loading loading-ball loading-xs"></span>
        <span class="loading loading-ball loading-sm"></span>
        <span class="loading loading-ball loading-md"></span>
        <span class="loading loading-ball loading-lg"></span>
        <span class="loading loading-ball loading-xl"></span>
      </div>
    </div>
  `;

  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => res.json())
    .then(data => {
      const arr = normalizePlantsResponse(data);
      renderPlants(arr);
    })

}

//Load plants by category id 
function loadCategory(id) {
  plantContainer.innerHTML = `
    <div class="col-span-full flex justify-center mb-4">
      <div class="flex space-x-2">
        <span class="loading loading-ball loading-xs"></span>
        <span class="loading loading-ball loading-sm"></span>
        <span class="loading loading-ball loading-md"></span>
        <span class="loading loading-ball loading-lg"></span>
        <span class="loading loading-ball loading-xl"></span>
      </div>
    </div>
  `;

  fetch(`https://openapi.programming-hero.com/api/category/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(json => {
      const arr = normalizePlantsResponse(json);
      renderPlants(arr);
    })
   
}

// Load categories 
function loadCategories() {
  fetch('https://openapi.programming-hero.com/api/categories')
    .then(res => res.json())
    .then(json => {
      categoryContainer.innerHTML = '';

      const allLi = document.createElement('li');
      allLi.textContent = 'All Trees';
      allLi.dataset.id = 'all';
      allLi.className = "hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200";
      categoryContainer.appendChild(allLi);

      const cats = json.categories ;
      cats.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.category_name;
        li.dataset.id = cat.id ;
        li.className = "hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200";
        categoryContainer.appendChild(li);
      });

      if (categoryContainer.firstElementChild) categoryContainer.firstElementChild.classList.add('bg-green-500','text-white');
      loadAllPlants();
    })
   

  categoryContainer.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    [...categoryContainer.children].forEach(x => x.classList.remove('bg-green-500','text-white'));
    li.classList.add('bg-green-500','text-white');

    const id = li.dataset.id;
    if (!id || id === 'all') loadAllPlants();
    else loadCategory(id);
  });
}

// Modal
function extractPlantObject(json) {
  const raw = json.plants;
  return Array.isArray(raw) ? raw[0] : raw;
}

function openPlantModal(id) {
  if (!id) return;
  const dialog = document.getElementById('plant_modal');
  const container = document.getElementById('modal-content-container');

  container.innerHTML = `<div class="p-6 text-center"><p class="font-semibold">Loading...</p></div>`;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute('open','');

  fetch(`https://openapi.programming-hero.com/api/plant/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(json => {
      const p = extractPlantObject(json);
      container.innerHTML = `
        <div class="p-4">
          <h3 class="text-xl font-bold">${p.name}</h3>
          <div class="mt-3">
            <img src="${p.image}" alt="${p.name}" class="w-full h-44 md:h-56 object-cover rounded-md" />
          </div>
          <h3 class="mt-2 text-sm font-bold">Categories: <span class="font-semibold text-[14px] text-gray-700 px-1 py-1 rounded-full">${p.category}</span></h3>
          <h3 class="mt-2 text-sm font-bold">Price: <span class="font-semibold text-[15px] text-gray-700 px-1 py-1 rounded-full">৳${p.price}</span></h3>
          <h3 class="mt-2 text-sm font-bold">Description: <span class="font-semibold text-[12px] text-gray-700 px-1 py-1 rounded-full">${p.description}</span></h3>
          <div class="mt-6 text-right">
            <button id="plant_modal_close_btn" class="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
          </div>
        </div>
      `;
      document.getElementById('plant_modal_close_btn').addEventListener('click', () => dialog.close());
    });
}

// Open modal 
plantContainer.addEventListener('click', e => {
  const el = e.target.closest('h3[data-id]');
  if (el) openPlantModal(el.getAttribute('data-id'));
});

//Start
loadCategories();          