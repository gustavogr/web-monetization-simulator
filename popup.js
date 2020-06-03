const noMonetization = document.getElementById("no-monetization");
const progressMonetization = document.getElementById("progress-monetization");
const form = document.getElementById("money-form");
const stopPayments = document.getElementById("stop-payment");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("hidden");
  progressMonetization.classList.remove("hidden");

  data = {
    currency: e.target.currency.value,
    scale: Number.parseInt(e.target.scale.value),
    amount: Number.parseInt(e.target.amount.value),
    interval: Number.parseInt(e.target.interval.value),
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.browserAction.setBadgeText({text: "$", tabId: activeTab.id});
    chrome.tabs.sendMessage(activeTab.id, {
      message: "popupFormSubmit",
      data: data,
    });
  });
});

stopPayments.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.browserAction.setBadgeText({text: "", tabId: activeTab.id});
    chrome.tabs.sendMessage(activeTab.id, { message: "popupStopPayments" });
  });
  progressMonetization.classList.add("hidden");
  form.classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      { message: "popupGetValues" },
      (response) => {
        if (!response) {
          form.classList.remove("hidden");
          return;
        }
        if (response === "noMonetization") {
          noMonetization.classList.remove("hidden");
          return;
        }

        form.currency.value = response.currency;
        form.scale.value = response.scale;
        form.amount.value = response.amount;
        form.interval.value = response.interval;

        if (response.active) {
          progressMonetization.classList.remove("hidden");
        } else {
          form.classList.remove("hidden");
        }
      }
    );
  });
});
