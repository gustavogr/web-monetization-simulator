document.getElementById('money-form').addEventListener("submit", (e) => {
    e.preventDefault();

    data = {
        "amount" : new Number(e.target.amount.value)
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "popupFormSubmit", data: data});
    });
});
