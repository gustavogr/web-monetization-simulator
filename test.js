const status = document.getElementById("monetization-state");
const money = document.getElementById("monetization-money");
let totalReceived = 0;

document.monetization.addEventListener("monetizationpending", (e) => {
  status.innerText = "pending";
  console.log("monetization is pending", e.detail);
});

document.monetization.addEventListener("monetizationstart", (e) => {
  status.innerText = "started";
  console.log("monetization has started", e.detail);
});

document.monetization.addEventListener("monetizationprogress", (e) => {
  totalReceived = e.detail.amount + totalReceived;
  money.innerText = totalReceived;
  console.log("monetization is in progress", e.detail);
});

document.monetization.addEventListener("monetizationstop", (e) => {
  status.innerText = "stopped";
  console.log("monetization has stopped", e.detail);
});
