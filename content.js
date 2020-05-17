const script = `
  document.monetization = new EventTarget();
  document.monetization.state = "stopped";

  window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
      return;

    if (event.data.type === "monetization_event") {
      console.log("Recieved monetization event: " + event.data.event);
      event = new CustomEvent("monetizationstart", { detail: event.data.event });
      document.monetization.dispatchEvent(event);
    }
  }, false);
`;

const element = document.createElement("script");
element.innerHTML = script;
document.documentElement.appendChild(element);

window.addEventListener("DOMContentLoaded", (e) => {
  window.postMessage(
    { type: "monetization_event", event: { somedaa: "thatdata" } },
    "*"
  );
});
