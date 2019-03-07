"use strict";
// TODO: get rid of global variables

const font = "'Roboto', sans-serif";

let amount = 0;

const api = "https://api.giphy.com/v1/gifs/search?";
const apiKey = "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O";
const limit = "&limit=1000";
let query = "";

let getGifBtn = document.getElementById("getGifBtn");
let searchForm = document.getElementById("searchForm");
let searchGifBar = document.getElementById("searchGifBar");
let cnt_clicks = 0;

getGifBtn.addEventListener("click", (event) => {
  let input = getInput("searchGifBar");

  if (input != "") {
    event.preventDefault();
    cnt_clicks++;
    if (cnt_clicks === 1) {
      let errorMessages = document.getElementsByClassName("errorMessage");
      let gif = document.getElementsByClassName("gif")[0];

      if (errorMessages.length !== 0) {
          [].map.call(errorMessages, (message) => message.remove());
      }

      if (typeof gif !== "undefined" && gif !== null) {
        gif.remove();
      }
      };

      query = setQuery(input);
      let url = api + query + apiKey + limit;

      loadJSON(url).then((giphy) => {
        let gifContainers = document.getElementById("gifContainer");

        let gif = document.createElement("img");
        gif.setAttribute("class", "gif");

        let src = randomInteger();
        gif.setAttribute("src", giphy.data[src].images.original.url);
        gifContainer.appendChild(gif);

        cnt_clicks = 0;
      }).catch((error) => {
        let gif = document.getElementsByClassName("gif")[0];
        if (typeof gif !== "undefined" && gif !== null) {
          gif.remove();
        };
          console.log(error.name + ': ' + error.message);

          let noGifs = document.createElement("h2");
          let text = document.createTextNode("There are no such gifs :(");

          noGifs.appendChild(text);
          gifContainer.appendChild(noGifs);
          noGifs.setAttribute("class", "errorMessage")
          noGifs.style.color = "white";
          noGifs.style.fontSize = "2em";
          noGifs.style.fontFamily = font;
          noGifs.style.margin = "50% auto 0 auto";

          cnt_clicks = 0;
        }
      )
    }
    }
);

document.addEventListener("keypress", function(event) {
    if (event.which === 13) {
        event.preventDefault();
        getGifBtn.click();
    }
});

function randomInteger() {
  return Math.floor(Math.random()*1000)
}

function setQuery(content) {
  content = content.replace(/\s/g, '-');
  return ""+`&q=${content}`;
}

function getInput(id) {
  let input = document.getElementById(id).value;
  return input;
}

let progressBars = document.getElementsByClassName("progressbar");
let progressValues = document.getElementsByClassName("progress-value");

function loadJSON(filePath) {
  return new Promise(function(resolve, reject) {
	  let xhr = new XMLHttpRequest();

    xhr.onloadstart = () => changeProgressWidth(progressValues, 20);

    // Obviously, this is incorrect, but I have no idea what to do
    // event.total is incomputable, for example, in Chrome.
    // However, the main goal of a progressbar is to indicate
    // that the gif is loading, and we achieve this
    xhr.onprogress = (event) => changeProgressWidth(progressValues, 80);

    xhr.onloadend = () => changeProgressWidth(progressValues, 100);

  	xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(Error(xhr.statusText));
        }
      }
    };

    xhr.onerror = () => {
      reject(Error("Network Error"));
    };
  	xhr.open("GET", filePath, true);
  	xhr.send();
  })
}

/**
* Changes width of a progress value by a particular percent
* @param {array} values - array-like object of progress values
* @param {number} precent
**/
function changeProgressWidth(values, percent) {
  values = [].map.call(values, (value) => value.style.width = percent+"%");
}
