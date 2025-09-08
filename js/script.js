// js/script.js

const categoryContainer = document.getElementById('category-container');
const plantContainer = document.getElementById('plant-container');

// --- render plant cards ---
function renderPlants(plants) {
  plantContainer.innerHTML = '';
  if (!plants || plants.length === 0) {
    plantContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No plants found.</p>';
    return;
  }

  plants.forEach(plant => {
    const img = plant.image || plant.image_url || 'assets/about.png';
    const name = plant.name || plant.plant_name || 'Unknown';
    let desc = plant.description || plant.short_description || '';
    const cat = plant.category || plant.category_name || 'Unknown';
    const price = (plant.price !== undefined && plant.price !== null) ? plant.price : '—';

    // Ensure we get id (id, _id, plant_id)
    const pid = plant.id ?? plant._id ?? plant.plant_id ?? null;

    if (desc.length > 80) desc = desc.substring(0, 80) + '...';

    const card = document.createElement('div');
    card.className = "w-full bg-white p-3 rounded-lg shadow-md flex flex-col";

    // NOTE: data-id on <h3> is required so modal knows which id to fetch.
    const safePidAttr = pid ? `data-id="${pid}"` : '';

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
    plantContainer.appendChild(card);
  });
}

// helper to normalize plant-list response to array
function normalizePlantsResponse(data) {
  // common shapes:
  // { plants: [...] } or { data: [...] } or { plants: {...} } single object
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.plants && Array.isArray(data.plants)) return data.plants;
  if (data.data && Array.isArray(data.data)) return data.data;
  // if single plant object
  if (data.plants && typeof data.plants === 'object') return [data.plants];
  if (data.data && typeof data.data === 'object') return [data.data];
  return [];
}

// --- load all plants ---
function loadAllPlants() {
  plantContainer.innerHTML = '<p class="p-4 text-center">Loading...</p>';
  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => res.json())
    .then(data => {
      const arr = normalizePlantsResponse(data);
      renderPlants(arr);
    })
    .catch(err => {
      plantContainer.innerHTML = '<p class="p-4 text-center text-red-500">Failed to load plants.</p>';
      console.error(err);
    });
}

// --- load plants by category id ---
function loadCategory(id) {
  plantContainer.innerHTML = '<p class="p-4 text-center">Loading...</p>';
  fetch(`https://openapi.programming-hero.com/api/category/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(json => {
      const arr = normalizePlantsResponse(json);
      renderPlants(arr);
    })
    .catch(err => {
      plantContainer.innerHTML = '<p class="p-4 text-center text-red-500">Failed to load category.</p>';
      console.error(err);
    });
}

// --- load categories ---
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

      const cats = json.categories || json.data || [];
      (Array.isArray(cats) ? cats : []).forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.category_name || cat.name || 'Unnamed';
        li.dataset.id = cat.id ?? cat.category_id ?? cat._id ?? '';
        li.className = "hover:bg-green-500 text-black font-semibold px-4 py-2 rounded cursor-pointer transition duration-200";
        categoryContainer.appendChild(li);
      });

      if (categoryContainer.firstElementChild) categoryContainer.firstElementChild.classList.add('bg-green-500','text-white');
      loadAllPlants();
    })
    .catch(err => {
      categoryContainer.innerHTML = '<li class="text-red-500">Failed to load categories</li>';
      console.error(err);
    });

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

// ---------------- Modal: fetch & show plant details ----------------

// extract single plant object from multiple possible response shapes
function extractPlantObject(json) {
  const raw = json.plants || json.data || json.plant || json;
  if (Array.isArray(raw)) return raw[0] || {};
  return (raw && typeof raw === 'object') ? raw : {};
}

function openPlantModal(id) {
  if (!id) return;
  const dialog = document.getElementById('plant_modal');
  const container = document.getElementById('modal-content-container');

  container.innerHTML = `<div class="p-6 text-center"><p class="font-semibold">Loading...</p></div>`;

  // open dialog (with fallback if dialog not supported)
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute('open','');

  fetch(`https://openapi.programming-hero.com/api/plant/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(json => {
      const p = extractPlantObject(json);

      const img = p.image || p.image_url || 'assets/about.png';
      const name = p.name || 'Unknown Plant';
      const category = p.category || p.category_name || 'Unknown';
      const price = (p.price !== undefined && p.price !== null) ? p.price : '—';
      const description = p.description || p.full_description || 'No description available.';

      // modal content in requested order: Name -> Image -> Category -> Price -> Description
      container.innerHTML = `
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold">${name}</h3>
            <button id="plant_modal_close" class="text-gray-600 hover:text-gray-900">✕</button>
          </div>

          <div class="mt-3">
            <img src="${img}" alt="${name}" class="w-full h-44 md:h-56 object-cover rounded-md" />
          </div>
            
             <h3 class=" mt-2 text-sm font-bold">Categories:<span class=" font-semibold text-[14px] text-gray-700 px-1 py-1 rounded-full">${category}</span></h3>
           
            <h3 class=" mt-2 text-sm font-bold"> Price: <span class=" font-semibold text-[15px] text-gray-700 px-1 py-1 rounded-full"> ৳${price}</span>
           </h3>

         
           <h3 class=" mt-2 text-sm font-bold">Description:<span class=" font-semibold text-[12px] text-gray-700 px-1 py-1 rounded-full">${description}</span></h3>

          <div class="mt-6 text-right">
            <button id="plant_modal_close_btn" class="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
          </div>
        </div>
      `;

      const closeBtnTop = document.getElementById('plant_modal_close');
      const closeBtnBottom = document.getElementById('plant_modal_close_btn');

      function closeDialog() {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute('open');
      }

      closeBtnTop && closeBtnTop.addEventListener('click', closeDialog);
      closeBtnBottom && closeBtnBottom.addEventListener('click', closeDialog);
    })
    .catch(err => {
      container.innerHTML = `
        <div class="p-6 text-center">
          <p class="text-red-500 font-semibold">Failed to load details</p>
          <div class="mt-4">
            <button id="plant_modal_close_err" class="px-4 py-2 rounded bg-gray-200">Close</button>
          </div>
        </div>
      `;
      const dialogCloseErr = document.getElementById('plant_modal_close_err');
      dialogCloseErr && dialogCloseErr.addEventListener('click', () => {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute('open');
      });
      console.error('Plant detail fetch error:', err);
    });
}

// delegate click on plant name to open modal
plantContainer.addEventListener('click', (e) => {
  const nameEl = e.target.closest('h3[data-id]');
  if (!nameEl) return;
  const id = nameEl.getAttribute('data-id');
  if (id) openPlantModal(id);
});

// close modal on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const dialog = document.getElementById('plant_modal');
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute('open');
  }
});

// start
loadCategories();
