function loadEvents() {
  const timelineSection = document.querySelector(".timeline");

  if (localStorage.length === 0) {
    timelineSection.innerHTML = `
        <div class="emptyTimeline">
          <h2>Sua timeline está vazia!</h2>
          <p>Adicione seu primeiro evento usando o formulário acima!</p>
        </div>
      `;
    return;
  }

  timelineSection.innerHTML = "<ul></ul>";
  const timelineList = timelineSection.querySelector("ul");

  let events = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const eventData = JSON.parse(localStorage.getItem(key));

    events.push({
      key,
      ...eventData,
    });
  }

  events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  events.forEach((eventData) => {
    const eventDate = new Date(eventData.eventDate + "T00:00:00");
    const formattedDate = eventDate.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timelineListItem = document.createElement("li");
    timelineListItem.innerHTML = `
        <div class="timelineListItem">
          <button class="moreButton" data-key="${eventData.key}">
            <i data-feather="more-vertical"></i>
          </button>
          <div class="dropdownMenu">
            <p class="editEvent">Editar</p>
            <p class="deleteEvent">Deletar</p>
          </div>
          <time>${formattedDate}</time>
          ${eventData.eventDescription}
        </div>

        <div id="editModal-${eventData.key}" class="modal">
          <div class="modalContent">
            <span class="close">&times;</span>
            <h2>Editar Evento</h2>
            <form class="editEventForm">
              <div>
                <label for="editEventDate-${eventData.key}">Data do Evento:</label>
                <input 
                  type="date" 
                  id="editEventDate-${eventData.key}" 
                  value="${eventData.eventDate}" 
                  required
                >
              </div>
              <div>
                <label for="editEventDescription-${eventData.key}">Descrição:</label>
                <input
                  type="text"
                  id="editEventDescription-${eventData.key}" 
                  value="${eventData.eventDescription}" 
                  required />
              </div>
              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      `;

    timelineList.appendChild(timelineListItem);
    feather.replace();
  });

  setupDropdowns();

  setupEditModals();
}

function setupDropdowns() {
  let currentOpenDropdown = null;

  document.querySelectorAll(".moreButton").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = button.nextElementSibling;

      if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
        currentOpenDropdown.classList.remove("show");
      }

      dropdown.classList.toggle("show");
      currentOpenDropdown = dropdown.classList.contains("show")
        ? dropdown
        : null;
    });
  });

  document.querySelectorAll(".deleteEvent").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const button = link
        .closest(".timelineListItem")
        .querySelector(".moreButton");
      const eventKey = button.getAttribute("data-key");
      deleteEvent(eventKey);
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdownMenu") && currentOpenDropdown) {
      currentOpenDropdown.classList.remove("show");
      currentOpenDropdown = null;
    }
  });
}

function setupEditModals() {
  document.querySelectorAll(".editEvent").forEach((editButton) => {
    editButton.addEventListener("click", (e) => {
      const eventKey = e.target
        .closest(".timelineListItem")
        .querySelector(".moreButton")
        .getAttribute("data-key");

      const modal = document.getElementById(`editModal-${eventKey}`);
      modal.style.display = "flex";

      modal.querySelector(".close").onclick = () => {
        modal.style.display = "none";
      };

      window.onclick = (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };

      const form = modal.querySelector(".editEventForm");
      form.onsubmit = (e) => {
        e.preventDefault();

        const updatedEventData = {
          eventDate: document.getElementById(`editEventDate-${eventKey}`).value,
          eventDescription: document.getElementById(
            `editEventDescription-${eventKey}`
          ).value,
        };

        localStorage.setItem(eventKey, JSON.stringify(updatedEventData));

        modal.style.display = "none";

        loadEvents();

        const eventEdited = new CustomEvent("eventEdited");

        document.dispatchEvent(eventEdited);
      };
    });
  });
}

function deleteEvent(eventKey) {
  localStorage.removeItem(eventKey);

  loadEvents();

  const eventDeleted = new CustomEvent("eventDeleted");

  document.dispatchEvent(eventDeleted);
}

document.addEventListener("DOMContentLoaded", loadEvents);

document.addEventListener("eventAdded", loadEvents);
