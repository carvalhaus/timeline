const addEventForm = document.getElementById("addEventForm");

addEventForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let eventDate = document.getElementById("eventDate").value;
  let eventDescription = document.getElementById("eventDescription").value;

  const event = {
    eventDate,
    eventDescription,
  };

  if (!validateForm(event)) {
    return;
  }

  localStorage.setItem(eventDescription, JSON.stringify(event));

  addEventForm.reset();
});

function validateForm(event) {
  let savedEvent = localStorage.getItem(event.eventDescription);

  if (savedEvent) {
    let parsedEvent = JSON.parse(savedEvent);

    if (parsedEvent.eventDescription === event.eventDescription) {
      alert("Você já possui um evento registrado com essa descrição!");
      return false;
    }
  }

  return true;
}
