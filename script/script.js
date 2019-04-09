"use strict";

document.getElementById("getGifBtn")
        .addEventListener("click", function (event) {
  let search = new SearchGiphy();
  search.perform(event);
});

document.addEventListener("keypress", function(event) {
    if (event.which === 13) {
        event.preventDefault();
        document.getElementById("getGifBtn").click();
    }
});

/**
* Represents a search through GIPHY
**/
function SearchGiphy() {
  this._font = "'Roboto', sans-serif";
  this._query = "";
  this._cnt_clicks = 0;
  this._api = "https://api.giphy.com/v1/gifs/search?";
  this._apiKey = "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O";
  this._limit = "&limit=1000";
}

/**
* Search through GIPHY for a particular gif
* @param {click} event
**/
SearchGiphy.prototype.perform = function(event) {
  let input = getInput("searchGifBar");

  if (input != "") {
    event.preventDefault();
    this._cnt_clicks++;

    this._deletePrevErrMsg();
    this._deletePrevGifs();
    this._setQuery(input);

    let url = this._makeURL();

    loadJSON(url)
                .then((giphy) => {
                    createGif(giphy);
                    this._cnt_clicks = 0;
                  })
                .catch((error) => {
                  this._deletePrevGifs();
                  console.log(error.name + ': ' + error.message);
                  createErrMsg(this._font);
                  this._cnt_clicks = 0;
                });
    };
};

/**
* Sets the query
* @param {string} content
**/
SearchGiphy.prototype._setQuery = function (content) {
  content = content.replace(/\s/g, '-');
  this._query = ""+`&q=${content}`;
}

/**
* Removes gifs that were searched for
**/
SearchGiphy.prototype._deletePrevGifs = function() {
  if (this._cnt_clicks === 1) {
    let gifs = document.getElementsByClassName("gif");
    [].map.call(gifs, (gif) => {
      if (typeof gif !== "undefined" && gif !== null) {
        gif.remove();
      }
    });
  }
};

/**
* Removes an error message
**/
SearchGiphy.prototype._deletePrevErrMsg = function() {
  if (this._cnt_clicks === 1) {
    let errorMessages = document.getElementsByClassName("errorMessage");
    if (errorMessages.length !== 0) {
        [].map.call(errorMessages, (message) => message.remove());
    }
  }
};

/**
* Creates a URL from an api, a query, a key and a limit
**/
SearchGiphy.prototype._makeURL = function() {
  return this._api + this._query + this._apiKey + this._limit;
}

/**
* Generates a random integer
**/function randomInteger() {
  return Math.floor(Math.random()*1000);
};

/**
* Gets value of an input with a particular id
* @param {string} id
**/
function getInput(id) {
  return document.getElementById(id).value;
};

/**
* Loads a JSON file
* @param {string} filePath - URL
**/
function loadJSON(filePath) {
  return new Promise(function(resolve, reject) {
	  let xhr = new XMLHttpRequest();

	    let progressValues = document.getElementsByClassName("progressValue");
	    xhr.onloadstart = function() {
		    changeProgressWidth(progressValues, 20);
		}
	    xhr.onprogress = function() {
		    changeProgressWidth(progressValues, 80);
	    }
	  xhr.onreadystatechange = function() {
	      if (xhr.readyState === XMLHttpRequest.DONE) {
		if (xhr.status === 200) {
		  resolve(JSON.parse(xhr.responseText));
		  changeProgressWidth(progressValues, 100);
		} else {
		  reject(new Error(xhr.statusText));
		}
	      }
	    };
	    xhr.onerror function() {
	      reject(new Error("Network Error"));
	    };
	  xhr.open("GET", filePath, true);
	  xhr.send();
	})
}

/**
* Inserts a gif into the DOM
* @param {JSON} json
**/
function createGif(json) {
  let gif = document.createElement("img");
  gif.setAttribute("class", "gif");

  let src = randomInteger();
  gif.setAttribute("src", json.data[src].images.original.url);

  let gifContainer = document.getElementById("gifContainer");
  gifContainer.appendChild(gif);
};

/**
* Inserts an error message into the DOM
* @param {string} font
**/
function createErrMsg(font) {
  let gifContainer = document.getElementById("gifContainer");
  let errorMessage = document.createElement("h2");
  let text = document.createTextNode("There are no such gifs :(");

  errorMessage.appendChild(text);
  gifContainer.appendChild(errorMessage);
  errorMessage.setAttribute("class", "errorMessage");

  errorMessage.style.color = "white";
  errorMessage.style.fontSize = "2em";
  errorMessage.style.fontFamily = font;
};

/**
* Changes width of a progress value by a particular percent
* @param {array} values - array-like object of progress values
* @param {number} precent
**/
function changeProgressWidth(values, percent) {
  values = [].map.call(values, (value) => value.style.width = percent+"%");
};
