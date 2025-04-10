const exercisePool = document.getElementById("exercisePool");
let draggedItem = null;

function initializeExercises() {
  for (const [bodyPart, items] of Object.entries(exercises)) {
    const partDiv = document.createElement("div");
    partDiv.innerHTML = `<h3 style="margin: 15px 0 5px;">${bodyPart}</h3>`;
    const itemContainer = document.createElement("div");
    itemContainer.className = "exercise-item-container";

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
      const exerciseItem = e.target.closest(".exercise-item");
      const tier = e.target.dataset.tier;
      const tierContainer = document.querySelector(
        `.tier-items[data-tier="${tier}"]`
      );
      if (exerciseItem && tierContainer) {
        tierContainer.appendChild(exerciseItem);
      }
    });
  });
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
    draggedItem = null;
  }
});

document.addEventListener("dragover", (e) => e.preventDefault());

const tierItems = document.querySelectorAll(".tier-items");
tierItems.forEach((tier) => {
  tier.addEventListener("dragover", (e) => e.preventDefault());
  tier.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem) tier.appendChild(draggedItem);
  });
});

exercisePool.addEventListener("dragover", (e) => e.preventDefault());
exercisePool.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedItem) exercisePool.appendChild(draggedItem);
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
