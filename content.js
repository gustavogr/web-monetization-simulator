"use strict";

// Util function for generating UUID V4

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Change monetization state

function changeState(state) {
  const states = ["stopped", "pending", "started"];
  if (!states.includes(state)) {
    console.warn("State not allowed:", state);
    return;
  }

  window.postMessage({ type: "monetizationStateChange", state: state });
}

// Events dispatcher functions

function dispatchMonetizationPending({ paymentPointer, requestId }) {
  window.postMessage(
    {
      type: "monetizationEvent",
      event: {
        type: "monetizationpending",
        detail: { paymentPointer, requestId },
      },
    },
    "*"
  );
}

function dispatchMonetizationStart({ paymentPointer, requestId }) {
  window.postMessage(
    {
      type: "monetizationEvent",
      event: {
        type: "monetizationstart",
        detail: { paymentPointer, requestId },
      },
    },
    "*"
  );
}

function dispatchMonetizationStop({
  paymentPointer,
  requestId,
  finalized = true,
}) {
  window.postMessage(
    {
      type: "monetizationEvent",
      event: {
        type: "monetizationstop",
        detail: { paymentPointer, requestId, finalized },
      },
    },
    "*"
  );
}

function dispatchMonetizationProgress({
  paymentPointer,
  requestId,
  amount,
  assetCode,
  assetScale,
}) {
  window.postMessage(
    {
      type: "monetizationEvent",
      event: {
        type: "monetizationprogress",
        detail: {
          paymentPointer,
          requestId,
          finalized,
          amount,
          assetCode,
          assetScale,
        },
      },
    },
    "*"
  );
}

// Injection Script

const script = `
    document.monetization = new EventTarget();
    document.monetization.state = "stopped";
  
    window.addEventListener("message", function(event) {
      // We only accept messages from ourselves
      if (event.source != window)
        return;
  
      if (event.data.type === "monetizationEvent") {
        const payload = event.data.event
        console.log("Recieved monetization event: " + payload);
        event = new CustomEvent(payload.type, { detail: payload.detail });
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

// Extension setup

let sessionId;
let paymentPointer;
sessionId = uuidv4();

const element = document.createElement("script");
element.innerHTML = script;
document.documentElement.appendChild(element);

window.addEventListener("DOMContentLoaded", (e) => {
  dispatchMonetizationStart({ paymentPointer, requestId: sessionId });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "popupFormSubmit") {
    console.log("received message from popup", request.data);
  }
});
console.log(sessionId);
