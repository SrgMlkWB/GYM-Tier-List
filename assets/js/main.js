const exercisePool = document.getElementById("exercisePool");
let draggedItem = null;

function initializeExercises() {
  for (const [bodyPart, items] of Object.entries(exercises)) {
    const partDiv = document.createElement("div");
    partDiv.className = "exercise-category";
    partDiv.innerHTML = `<h3 style="margin: 15px 0 5px;">${bodyPart}</h3>`;
    const itemContainer = document.createElement("div");
    itemContainer.className = "exercise-item-container";
    itemContainer.dataset.category = bodyPart;

    items.forEach((exercise) => {
      const div = document.createElement("div");
      div.className = "exercise-item";
      div.draggable = true;
      div.innerHTML = `
        <video class="exercise-video" autoplay loop muted playsinline>
            <source src="${exercise.video}" type="video/mp4">
            Votre navigateur ne supporte pas la vidéo.
        </video>
        <div class="exercise-overlay">
            <span class="exercise-name">${exercise.name}</span>
            <div class="tier-buttons">
                <button class="tier-btn s-tier" data-tier="S">S</button>
                <button class="tier-btn a-tier" data-tier="A">A</button>
                <button class="tier-btn b-tier" data-tier="B">B</button>
                <button class="tier-btn c-tier" data-tier="C">C</button>
                <button class="tier-btn d-tier" data-tier="D">D</button>
            </div>
        </div>
      `;
      itemContainer.appendChild(div);
    });
    partDiv.appendChild(itemContainer);
    exercisePool.appendChild(partDiv);
  }

  // Ajouter les événements de clic pour les boutons
  document.querySelectorAll(".tier-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Empêche la propagation de l'événement
      const exerciseItem = e.target.closest(".exercise-item");
      const tier = e.target.dataset.tier;
      const tierContainer = document.querySelector(`.tier-items[data-tier="${tier}"]`);

      if (exerciseItem && tierContainer) {
        tierContainer.appendChild(exerciseItem.cloneNode(true));
        exerciseItem.remove(); // Supprime l'original
        checkCategoryVisibility(); // Met à jour la visibilité
      }
    });
  });
}

// Fonction pour vérifier et mettre à jour la visibilité des catégories
function checkCategoryVisibility(movedItem) {
  const categories = document.querySelectorAll(".exercise-category");
  const exercisePool = document.getElementById("exercisePool");
  let totalItems = 0;

  categories.forEach((category) => {
    const itemContainer = category.querySelector(".exercise-item-container");
    const title = category.querySelector("h3");
    const itemCount = itemContainer.children.length;

    totalItems += itemCount;

    if (itemCount === 0) {
      category.style.display = "none";
      if (title) title.style.display = "none";
    } else {
      category.style.display = "block";
      if (title) title.style.display = "block";
    }
  });

  // Mise à jour de la hauteur du pool en fonction du contenu
  if (totalItems === 0) {
    exercisePool.style.display = "none";
    document.documentElement.style.setProperty("--pool-height", "0px");
  } else {
    exercisePool.style.display = "block";

    // Calcul de la hauteur nécessaire
    const poolHeight = Math.min(
      exercisePool.scrollHeight,
      window.innerWidth <= 1200 ? window.innerHeight * 0.5 : window.innerHeight - 20
    );

    // Mise à jour de la variable CSS pour le padding-bottom du body
    document.documentElement.style.setProperty("--pool-height", `${poolHeight}px`);

    // Ajustement des colonnes en fonction du nombre d'items
    const containers = exercisePool.querySelectorAll(".exercise-item-container");
    containers.forEach((container) => {
      const itemCount = container.children.length;
      if (itemCount <= 2) {
        container.style.gridTemplateColumns = `repeat(${itemCount}, 240px)`;
      } else {
        container.style.gridTemplateColumns = "repeat(auto-fit, 240px)";
      }
    });
  }
}

document.addEventListener("dragstart", (e) => {
  if (e.target.className.includes("exercise-item")) {
    draggedItem = e.target;
    setTimeout(() => draggedItem.classList.add("dragging"), 0);
  }
});

document.addEventListener("dragend", () => {
  if (draggedItem) {
    draggedItem.classList.remove("dragging");
    checkCategoryVisibility(draggedItem);
    draggedItem = null;
  }
});

document.addEventListener("dragover", (e) => e.preventDefault());

const tierItems = document.querySelectorAll(".tier-items");
tierItems.forEach((tier) => {
  tier.addEventListener("dragover", (e) => e.preventDefault());
  tier.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem) {
      tier.appendChild(draggedItem);
      checkCategoryVisibility(draggedItem);
    }
  });
});

exercisePool.addEventListener("dragover", (e) => e.preventDefault());
exercisePool.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedItem) {
    const category = draggedItem.closest(".exercise-item-container");
    if (category) {
      category.appendChild(draggedItem);
      checkCategoryVisibility(draggedItem);
    } else {
      exercisePool.appendChild(draggedItem);
    }
  }
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  html2canvas(document.querySelector(".tier-container")).then((canvas) => {
    const link = document.createElement("a");
    link.download = "tier-list-musculation.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

initializeExercises();
checkCategoryVisibility(); // Appeler checkCategoryVisibility après l'initialisation
