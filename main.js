"use strict";

const font = "'Roboto', sans-serif";

const api = "https://api.giphy.com/v1/gifs/search?";
const apiKey = "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O";
const limit = "&limit=1000";
let query = "";

let getGifBtn = document.getElementById("getGif");
let searchForm = document.getElementById("form");
let searchInput = document.getElementById("search");
let cnt_clicks = 0;

getGifBtn.addEventListener("click", (event) => {
  if (getInput("search") != ""){
    event.preventDefault();
    cnt_clicks++;
    if (cnt_clicks === 1){
      let gif = document.getElementById("gif");
      if (typeof(gif) != 'undefined' && gif != null){
        gif.remove();
      };

      query = setQuery(getInput("search"));
      let url = api + query + apiKey + limit;

      loadJSON(url).then((giphy) => {
        let gifContainer = document.getElementById("gifContainer");
        let gif = document.createElement("img");
        gif.setAttribute("id", "gif");
        let src = randomInteger();
        gif.setAttribute("src", giphy.data[src].images.original.url);
        gifContainer.appendChild(gif);
        cnt_clicks = 0;
      }).catch((error) =>
        {
          console.log(error.name + ': ' + error.message);
          let h2 = document.createElement("h2");
          let text = document.createTextNode("There are no such gifs :(");
          h2.appendChild(text);
          gifContainer.appendChild(h2);
          h2.style.color = "white";
          h2.style.fontSize = "2em";
          h2.style.fontFamily = font;
          h2.style.margin = "50% auto 0 auto";
        }
      )
    }
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

function setQuery(content){
  content = content.replace(/\s/g, '-');
  return ""+`&q=${content}`;
}

function getInput(id) {
  let input = document.getElementById(id).value;
  return input;
}

function loadJSON(filePath) {
  return new Promise(function(resolve, reject) {
	   let xhr = new XMLHttpRequest();
     let progressBar = document.getElementById("progressbar");
     let progressValue = document.getElementById("progress-value");

    xhr.onloadstart = (e) => {
      progressValue.style.width = "50%";
    };

      xhr.onloadend = (e) => {
        progressValue.style.width = "100%";
      }
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
