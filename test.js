console.log("Monetization in test script:", document.monetization);

document.monetization.addEventListener("monetizationpending", (e) => {
  console.log("monetization is pending", e.detail);
});

document.monetization.addEventListener("monetizationstart", (e) => {
  console.log("recieved money event", e);
});
