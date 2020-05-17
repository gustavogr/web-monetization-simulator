console.log("Monetization in test script:", document.monetization);

document.monetization.addEventListener("monetizationstart", (e) => {
  console.log("recieved money event", e);
});
