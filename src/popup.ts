import { Problem } from "./types";
//Dev Stuffs
const console = chrome.extension.getBackgroundPage().console;
//Cache Dom
const problemTitleDiv = document.querySelector(
  "#problem-title"
) as HTMLSpanElement;
const difficultyDiv = document.querySelector(
  "#difficulty-div"
) as HTMLSpanElement;
// Get Title of the Current Page and URL

chrome.tabs.query({ active: true }, function (tabs: chrome.tabs.Tab[]) {
  renderTimerPage(tabs[0]);
});

function renderTimerPage(tab: chrome.tabs.Tab) {
  console.log("hi");

  let urlRegex: RegExp = new RegExp("https://leetcode.com/problems/*");
  let url = tab.url;
  if (urlRegex.test(url)) {
    let title: string = "a";
    let problemDict: Problem = {};
    // chrome.runtime.onMessage.addListener(function (
    //   request,
    //   sender,
    //   sendResponse
    // ) {
    //   const problemDict: Problem={}
    //   chrome.runtime.sendMessage({action:"getProblem"}, function (request) {
    //     problemDict.problemName =request.problemName;
    //     problemDict.difficulty =request.difficulty;
    //   });

    // });
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
}

function createElement(): HTMLElement {
  const div: HTMLElement = document.createElement("div");
  return div;
}
