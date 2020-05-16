const script = `
  document.monetization = document.createElement("div");
  document.monetization.state = "stopped";
`;

const element = document.createElement("script");
element.innerHTML = script;
document.documentElement.appendChild(element);
