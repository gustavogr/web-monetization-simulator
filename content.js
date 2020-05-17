const script = `
  document.monetization = new EventTarget();
  document.monetization.state = "stopped";

  window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
      return;

    if (event.data.type === "monetizationEvent") {
      console.log("Recieved monetization event: " + event.data.event);
      event = new CustomEvent("monetizationstart", { detail: event.data.event });
      document.monetization.dispatchEvent(event);
      return;
    }

    if (event.data.type === "monetizationStateChange") {
      console.log("Recieved monetization state change: " + event.data.state);
      document.monetization.state = event.data.state
      return;
    }
  }, false);
`;

const element = document.createElement("script");
element.innerHTML = script;
document.documentElement.appendChild(element);

window.addEventListener("DOMContentLoaded", (e) => {
  window.postMessage(
    { type: "monetizationEvent", event: { somedaa: "thatdata" } },
    "*"
  );

  window.postMessage({ type: "monetizationStateChange", state: "pending" });
});
