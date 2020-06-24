import { Problem, Action } from "./types";

//Dev Stuffs
// @ts-ignore
const console = chrome.extension.getBackgroundPage().console;
//Cache Dom
const problemTitleDiv = document.querySelector(
  "#problem-title"
) as HTMLSpanElement;
const difficultyDiv = document.querySelector(
  "#difficulty-div"
) as HTMLSpanElement;
const startBtn = document.getElementById("start") as HTMLButtonElement;
const resetBtn = document.getElementById("reset") as HTMLButtonElement;
// Get Title of the Current Page and URL
const backgroundPage = chrome.extension.getBackgroundPage();

//  Background Page


renderTimerPage();

function renderTimerPage() {
  let problemDict: Problem = {};

  const action: Action = {
    action: "getProblem",
  };
  chrome.runtime.sendMessage({ action: "getProblem" }, function (
    response: Problem
  ) {
    console.log(response);
    problemDict.problemName = response.problemName;
    problemDict.difficulty = response.difficulty;
    if (problemDict.problemName) {
      let name = problemDict.problemName.split(".")[1];
      let difficulty = problemDict.difficulty;
      problemTitleDiv.innerText = name;
      difficultyDiv.innerText = difficulty;

      difficultyDiv.classList.add(difficulty.toLowerCase());
    }
  });
}

function createElement(): HTMLElement {
  const div: HTMLElement = document.createElement("div");
  return div;
}

//@ts-ignore
startBtn.addEventListener("click", function () {
  //@ts-ignore
  backgroundPage.startStop();
});

resetBtn.addEventListener("click", function () {
  //@ts-ignore
  backgroundPage.resetFunc();
});
