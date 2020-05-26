console.log("Monetization in test script:", document.monetization);

document.monetization.addEventListener("monetizationpending", (e) => {
  console.log("monetization is pending", e.detail);
});

document.monetization.addEventListener("monetizationstart", (e) => {
  console.log("monetization has started", e.detail);
});

document.monetization.addEventListener("monetizationprogress", (e) => {
  console.log("monetization is in progress", e.detail);
});

document.monetization.addEventListener("monetizationstop", (e) => {
  console.log("monetization has stopped", e.detail);
});
