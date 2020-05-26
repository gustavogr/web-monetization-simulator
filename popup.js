const noMonetization = document.getElementById('no-monetization');
const progressMonetization = document.getElementById('progress-monetization');
const form = document.getElementById('money-form');
const stopPayments = document.getElementById('stop-payment');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.setAttribute("hidden", "true");
    progressMonetization.removeAttribute("hidden");

    data = {
        currency: e.target.currency.value,
        scale: new Number(e.target.scale.value),
        amount: new Number(e.target.amount.value),
        interval: new Number(e.target.interval.value)
        // limit: new Number(e.target.limit.value)
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "popupFormSubmit", data: data});
    });
});

stopPayments.addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {message: "popupStopPayments"});
  });
  progressMonetization.setAttribute("hidden", "true");
  form.removeAttribute("hidden");
});

document.addEventListener("DOMContentLoaded", (e) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {message: "popupGetValues"}, (response) => {
        if (response === "noMonetization") {
          noMonetization.removeAttribute("hidden");
        } else if (response) {
          form.currency.value = response.currency;
          form.scale.value = response.scale;
          form.amount.value = response.amount;
          form.interval.value = response.interval;
          // form.limit.value = response.limit;
          progressMonetization.removeAttribute("hidden");
        } else {
          form.removeAttribute("hidden");
        }
      });
    });
  });
