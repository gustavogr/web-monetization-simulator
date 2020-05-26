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

function changeMonetizationState(state) {
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
        event = new CustomEvent(payload.type, { detail: payload.detail });
        document.monetization.dispatchEvent(event);
        return;
      }

      if (event.data.type === "monetizationStateChange") {
        document.monetization.state = event.data.state
        return;
      }
    }, false);
  `;

// Extension setup
let sessionId;
let paymentPointer;
let data;
let intervalHandler;

const element = document.createElement("script");
element.innerHTML = script;
document.documentElement.appendChild(element);

// TODO: we should also add a MutationObserver in case the meta monetization tag
//       is set dynamically and not hardcoded on the incoming HTML.

document.addEventListener("DOMContentLoaded", (e) => {
  let meta_monetization = document.querySelector('meta[name="monetization"]');

  if (meta_monetization) {
    paymentPointer = meta_monetization.content;
    sessionId = uuidv4();
    changeMonetizationState("pending");
    dispatchMonetizationPending({ paymentPointer, requestId: sessionId });
  } else {
    data = "noMonetization";
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "popupFormSubmit") {
    data = request.data;
    changeMonetizationState("started");
    dispatchMonetizationStart({ paymentPointer, requestId: sessionId });
    dispatchMonetizationProgress({
      paymentPointer,
      requestId: sessionId,
      assetCode: data.currency,
      assetScale: data.scale,
      amount: data.amount
    });

    intervalHandler = setInterval(() => {
      dispatchMonetizationProgress({
        paymentPointer,
        requestId: sessionId,
        assetCode: data.currency,
        assetScale: data.scale,
        amount: data.amount
      });
    }, data.interval);
  }

  if (request.message === "popupGetValues") {
    sendResponse(data);
  }

  if (request.message === "popupStopPayments") {
    clearInterval(intervalHandler);
    changeMonetizationState("stopped");
    dispatchMonetizationStop({paymentPointer, requestId: sessionId, finalized: false});
  }
});
