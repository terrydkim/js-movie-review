(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgB7ZhBbtQwFIZ/zyAxu8IN0hNANqh0Q+YG9ASlJyhzgpmeADgBvQG9QbOCJXMDwgnIqoyEqPnjcWmVxElsPU9bKZ/kZuQ4rp/f+/OeA4yMjDxqFCKhvyHh7B+gUWKGhUp5jcATxGPJxb81v67wk39XiMAE8cj+/5riVH/HM0QgigEMn3e8JLcdXPzvOwYJEssDx40ehVNEQFzERrzAj9abU6TqFdYQJIYHls47f6yoBYlhQOa8E0HMogY0xNsYIC9maQ8c944QFrOYiDvFW2eG51KZWdIDy8Ejr/AeQnh7wIhwwzZl+8s2YbvGC/iXCmd8ds1nS85Vcq6qZip9PdNqAMOh2s3ENMUFattUnHKguQAaoYwhBbarLNm3Vq9pdI2GAfZN8hkPEc2q9hAf73ZNWgbtZpdDUM3wahhgLTzDQ0PjE0PovN7tFDFDaQWfN0tMWkLnhs63EI3IsNVDgvtgK+Yj7nzuGtL7GrUJ6hK7N6Jgm3PxRdeg3kRmJ5iz5dgdOXNC2rf4Cq9EthNdVGI9HJ6p/TNxTCM6xOoiqJjTX3kwUfgCWeZdYnURXI3SE1XlmUCGgovfRwBhHrhktp7hFyQJLLHDyukZXkKaTdicYQZo+cN56JyhB5o3kCdoTv/XaIz4vyFAB/4eeBrnE6Eh4ItFSAhlA8cVbCe2FQOfyeBJiAH9scpywNYy56aG3yA1fRJz1/CrhfriX/GQXpUDjow6qLL11IGfB1zxr82he6EOzK7nrser6tJmXPeJz1MHfgao1mSTsz/1KcJoxIqXfT530XI7gwd+BlzzH2rr3u31hIuZD6nb6xhvHOAIdZFPsAcPQsrpBNUuzXAh9XnQzrnipuxxRYuQDRkZGRm5H/4BIkyx5W7xkPAAAAAASUVORK5CYII=";
console.log("npm run dev 명령어를 통해 영화 리뷰 미션을 시작하세요");
console.log(
  "%c _____ ______   ________  ___      ___ ___  _______                \n|\\   _ \\  _   \\|\\   __  \\|\\  \\    /  /|\\  \\|\\  ___ \\               \n\\ \\  \\\\\\__\\ \\  \\ \\  \\|\\  \\ \\  \\  /  / | \\  \\ \\   __/|              \n \\ \\  \\\\|__| \\  \\ \\  \\\\\\  \\ \\  \\/  / / \\ \\  \\ \\  \\_|/__            \n  \\ \\  \\    \\ \\  \\ \\  \\\\\\  \\ \\    / /   \\ \\  \\ \\  \\_|\\ \\           \n   \\ \\__\\    \\ \\__\\ \\_______\\ \\__/ /     \\ \\__\\ \\_______\\          \n    \\|__|     \\|__|\\|_______|\\|__|/       \\|__|\\|_______|          \n                                                                   \n                                                                   \n                                                                   \n ________  _______   ___      ___ ___  _______   ___       __      \n|\\   __  \\|\\  ___ \\ |\\  \\    /  /|\\  \\|\\  ___ \\ |\\  \\     |\\  \\    \n\\ \\  \\|\\  \\ \\   __/|\\ \\  \\  /  / | \\  \\ \\   __/|\\ \\  \\    \\ \\  \\   \n \\ \\   _  _\\ \\  \\_|/_\\ \\  \\/  / / \\ \\  \\ \\  \\_|/_\\ \\  \\  __\\ \\  \\  \n  \\ \\  \\\\  \\\\ \\  \\_|\\ \\ \\    / /   \\ \\  \\ \\  \\_|\\ \\ \\  \\|\\__\\_\\  \\ \n   \\ \\__\\\\ _\\\\ \\_______\\ \\__/ /     \\ \\__\\ \\_______\\ \\____________\\\n    \\|__|\\|__|\\|_______|\\|__|/       \\|__|\\|_______|\\|____________|",
  "color: #d81b60; font-size: 14px; font-weight: bold;"
);
addEventListener("load", () => {
  const app = document.querySelector("#app");
  const buttonImage = document.createElement("img");
  buttonImage.src = image;
  if (app) {
    app.appendChild(buttonImage);
  }
});
