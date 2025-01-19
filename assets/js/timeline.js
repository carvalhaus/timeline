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

    events.push(eventData);
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
        <div>
          <i data-feather="trash-2" class="deleteIcon" data-key="${eventData.eventDescription}"></i>
          <time>${formattedDate}</time>
          ${eventData.eventDescription}
        </div>
      `;

    timelineList.appendChild(timelineListItem);
    feather.replace();
  });

  const deleteIcons = document.querySelectorAll(".deleteIcon");

  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", () => deleteEvent(deleteIcon));
  });
}

function deleteEvent(deleteIcon) {
  const eventKey = deleteIcon.getAttribute("data-key");

  localStorage.removeItem(eventKey);
  
  loadEvents();

  const eventDeleted = new CustomEvent("eventDeleted");

  document.dispatchEvent(eventDeleted);
}

document.addEventListener("DOMContentLoaded", loadEvents);

document.addEventListener("eventAdded", loadEvents);
