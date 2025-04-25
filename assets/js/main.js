const exercisePool = document.getElementById("exercisePool");
let draggedItem = null;

// Fonction pour ajouter le label de classe de tier à un élément
function addTierClassLabel(exerciseItem, tier) {
  // Supprimer tout label existant
  const existingLabel = exerciseItem.querySelector(".tier-class-label");
  if (existingLabel) {
    existingLabel.remove();
  }

  // Créer et ajouter le nouveau label
  const tierLabel = document.createElement("div");
  tierLabel.className = `tier-class-label ${tier.toLowerCase()}-tier`;
  tierLabel.textContent = tier;
  exerciseItem.appendChild(tierLabel);
}

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

  // Utilise la fonction globale addTierClassLabel définie plus bas

  // Ajouter les événements de clic pour les boutons
  document.querySelectorAll(".tier-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Empêche la propagation de l'événement
      const exerciseItem = e.target.closest(".exercise-item");
      const tier = e.target.dataset.tier;
      const tierContainer = document.querySelector(`.tier-items[data-tier="${tier}"]`);

      if (exerciseItem && tierContainer) {
        const clonedItem = exerciseItem.cloneNode(true);
        addTierClassLabel(clonedItem, tier);
        tierContainer.appendChild(clonedItem);
        exerciseItem.remove(); // Supprime l'original

        // Réattacher les événements de clic aux boutons du clone
        clonedItem.querySelectorAll(".tier-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = e.target.closest(".exercise-item");
            const newTier = e.target.dataset.tier;
            const newTierContainer = document.querySelector(`.tier-items[data-tier="${newTier}"]`);

            if (item && newTierContainer) {
              const newClonedItem = item.cloneNode(true);
              addTierClassLabel(newClonedItem, newTier);
              newTierContainer.appendChild(newClonedItem);
              item.remove();
              checkCategoryVisibility();
            }
          });
        });

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
  } else {
    exercisePool.style.display = "block";

    // Ajout d'indicateurs de défilement pour mobile
    if (window.innerWidth <= 1200) {
      // Supprime les indicateurs existants
      const existingIndicators = document.querySelectorAll(".scroll-indicator");
      existingIndicators.forEach((ind) => ind.remove());

      // Ajoute des indicateurs de défilement si nécessaire
      const containers = exercisePool.querySelectorAll(".exercise-item-container");
      containers.forEach((container) => {
        if (container.scrollWidth > container.clientWidth && container.children.length > 1) {
          const leftIndicator = document.createElement("div");
          leftIndicator.className = "scroll-indicator left-indicator";
          leftIndicator.innerHTML = "&lt;";

          const rightIndicator = document.createElement("div");
          rightIndicator.className = "scroll-indicator right-indicator";
          rightIndicator.innerHTML = "&gt;";

          container.parentNode.appendChild(leftIndicator);
          container.parentNode.appendChild(rightIndicator);
        }
      });
    }
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

// Utilise la fonction addTierClassLabel définie au début du fichier

const tierItems = document.querySelectorAll(".tier-items");
tierItems.forEach((tier) => {
  tier.addEventListener("dragover", (e) => e.preventDefault());
  tier.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem) {
      // Ajouter le label de classe de tier
      const tierLetter = tier.dataset.tier;
      addTierClassLabel(draggedItem, tierLetter);

      tier.appendChild(draggedItem);
      checkCategoryVisibility(draggedItem);
    }
  });
});

exercisePool.addEventListener("dragover", (e) => e.preventDefault());
exercisePool.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedItem) {
    // Supprimer le label de classe de tier quand l'élément est remis dans le pool
    const existingLabel = draggedItem.querySelector(".tier-class-label");
    if (existingLabel) {
      existingLabel.remove();
    }

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

// Fonction pour faire défiler les cartes
function setupScrollIndicators() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("left-indicator")) {
      const category = e.target.closest(".exercise-category");
      const container = category.querySelector(".exercise-item-container");
      container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
    } else if (e.target.classList.contains("right-indicator")) {
      const category = e.target.closest(".exercise-category");
      const container = category.querySelector(".exercise-item-container");
      container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    }
  });

  // Amélioration pour les appareils tactiles
  if ("ontouchstart" in window) {
    // Ajouter des gestionnaires d'événements tactiles pour le défilement
    document.querySelectorAll(".exercise-item-container").forEach((container) => {
      let startX, scrollLeft;

      container.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
        },
        { passive: true }
      );

      container.addEventListener(
        "touchmove",
        (e) => {
          if (!startX) return;
          const x = e.touches[0].pageX - container.offsetLeft;
          const walk = (x - startX) * 2; // Vitesse de défilement
          container.scrollLeft = scrollLeft - walk;
        },
        { passive: true }
      );
    });
  }
}

// Améliorer les boutons de tier pour les appareils tactiles
function enhanceTierButtons() {
  if ("ontouchstart" in window) {
    document.querySelectorAll(".tier-btn").forEach((btn) => {
      btn.addEventListener("touchstart", () => {
        btn.style.transform = "scale(1.2)";
      });

      btn.addEventListener("touchend", () => {
        btn.style.transform = "";
      });
    });
  }
}

initializeExercises();
checkCategoryVisibility(); // Appeler checkCategoryVisibility après l'initialisation
setupScrollIndicators(); // Configurer les indicateurs de défilement
enhanceTierButtons(); // Améliorer les boutons pour les appareils tactiles

// Recalculer lors du redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  checkCategoryVisibility();
});
