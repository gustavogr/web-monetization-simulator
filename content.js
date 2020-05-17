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

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const sessionId = uuidv4();

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "popupFormSubmit") {
    console.log("received message from popup", request.data);
  }
});
console.log(sessionId);
