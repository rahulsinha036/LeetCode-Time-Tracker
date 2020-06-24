import { Problem, Action } from "./types";
import { Chart } from "chart.js";
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
const tableDiv = document.querySelector("#problem-table");

// Buttons Div

const startBtn = document.getElementById("start") as HTMLButtonElement;
const resetBtn = document.getElementById("reset") as HTMLButtonElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
// Get Title of the Current Page and URL
const backgroundPage = chrome.extension.getBackgroundPage();

//  Background Page

//@ts-ignore
startBtn.addEventListener("click", function () {
  //@ts-ignore
  backgroundPage.startStop();
});

resetBtn.addEventListener("click", function () {
  //@ts-ignore
  backgroundPage.resetFunc();
});

saveBtn.addEventListener("click", function () {
  //@ts-ignore
  backgroundPage.saveData();
});

renderTimerPage();

document.addEventListener("DOMContentLoaded", function () {
  renderChart();
  renderTable();
});

function renderTimerPage() {
  let problemDict: Problem = {};

  const action: Action = {
    action: "getProblem",
  };
  chrome.runtime.sendMessage(action, function (response: Problem) {
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

// Listeners

chrome.runtime.onMessage.addListener(function (request) {
  if (request.showGraph) {
    renderChart();
    clearUI();
    renderTable();
  }
});

function createElement(): HTMLElement {
  const div: HTMLElement = document.createElement("div");
  return div;
}

function clearUI() {
  tableDiv.innerHTML = null;
}
//@ts-ignore

function renderChart() {
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  const items = localStorage.getItem("leetCodeExtensionDetails");
  if (items) {
    const parsedItem = JSON.parse(items);
    easyCount = parsedItem.easy.filter(
      (item) => typeof item.duplicateIndex == "number"
    ).length;
    mediumCount = parsedItem.medium.filter(
      (item) => typeof item.duplicateIndex == "number"
    ).length;
    hardCount = parsedItem.hard.filter(
      (item) => typeof item.duplicateIndex == "number"
    ).length;
  }
  //@ts-ignore
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Easy", "Medium", "Hard"],
      datasets: [
        {
          label: "# of Votes",
          data: [easyCount, mediumCount, hardCount],
          backgroundColor: [
            "rgb(68,160,72)",
            "rgb(239,113,9)",
            "rgb(233,32,99)",
          ],
        },
      ],
    },
    options: {},
  });
}

function renderTable() {
  const items = localStorage.getItem("leetCodeExtensionDetails");
  if (items) {
    const parsed = JSON.parse(items);
    const easyProblems = parsed.easy;
    const mediumProblems = parsed.medium;
    const hardProblems = parsed.hard;
    renderItem(easyProblems, "easy");
    renderItem(mediumProblems, "medium");
    renderItem(hardProblems, "hard");
  }
}

function renderItem(items, classname) {
  for (const item of items) {
    const row = document.createElement("tr");
    const problemName = document.createElement("td");
    const timeTaken = document.createElement("td");
    problemName.innerText = item.problemName;
    const difficulty = document.createElement("td");
    const dateSolved = document.createElement("td");
    difficulty.innerText = item.difficulty;
    difficulty.classList.add(classname);
    timeTaken.innerText = item.timeTaken;
    dateSolved.innerText = item.date;
    row.appendChild(problemName);
    row.appendChild(difficulty);
    row.appendChild(timeTaken);
    row.appendChild(dateSolved);

    tableDiv.appendChild(row);
  }
}
