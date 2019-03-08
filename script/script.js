"use strict";
// TODO: get rid of global variables

function makeURL(api, query, apiKey, limit) {
  return api + query + apiKey + limit;
}

function Search() {
  this._font = "'Roboto', sans-serif";
  this._query = "";
  //this._searchForm = document.getElementById("searchForm");
  //this._searchGifBar = document.getElementById("searchGifBar");
  this._cnt_clicks = 0;
}


Search.prototype.perform = function() {
  let input = getInput("searchGifBar");

  if (input != "") {
    event.preventDefault();
    this._cnt_clicks++;
    if (this._cnt_clicks === 1) {
      let errorMessages = document.getElementsByClassName("errorMessage");
      let gif = document.getElementsByClassName("gif")[0];

      if (errorMessages.length !== 0) {
          [].map.call(errorMessages, (message) => message.remove());
      }

      if (typeof gif !== "undefined" && gif !== null) {
        gif.remove();
      }
      };

      this._query = setQuery(input);

      let url = makeURL("https://api.giphy.com/v1/gifs/search?", this._query, "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O", "&limit=1000");

      loadJSON(url).then((giphy) => {
        let gifContainers = document.getElementById("gifContainer");

        let gif = document.createElement("img");
        gif.setAttribute("class", "gif");

        let src = randomInteger();
        gif.setAttribute("src", giphy.data[src].images.original.url);
        gifContainer.appendChild(gif);

        this._cnt_clicks = 0;
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
          noGifs.style.fontFamily = this._font;
          noGifs.style.margin = "50% auto 0 auto";

          this._cnt_clicks = 0;
        }
      )
    }
    }
//);


// search.perform();

document.getElementById("getGifBtn").addEventListener("click", function (event) {
  let search = new Search();
  search.perform();
})

document.addEventListener("keypress", function(event) {
    if (event.which === 13) {
        event.preventDefault();
        document.getElementById("getGifBtn").click();
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

function loadJSON(filePath) {
  return new Promise(function(resolve, reject) {
	  let xhr = new XMLHttpRequest();

    let progressValues = document.getElementsByClassName("progress-value");
    xhr.onloadstart = () => changeProgressWidth(progressValues, 20);

    // Obviously, this is incorrect, but I have no idea what to do,
    // because event.total is incomputable, for example, in Chrome.
    // However, the main goal of a progressbar is to indicate
    // that the gif is loading, and we achieve this
    xhr.onprogress = () => changeProgressWidth(progressValues, 80);

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
