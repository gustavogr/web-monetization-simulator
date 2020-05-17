document.getElementById('money-form').addEventListener("submit", (e) => {
    e.preventDefault();

    data = {
        "currency" : e.target.currency.value,
        "amount" : new Number(e.target.amount.value),
        "interval" : new Number(e.target.interval.value),
        "limit" : new Number(e.target.limit.value)
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "popupFormSubmit", data: data});
    });
});
