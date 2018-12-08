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

      loadJSON(url, (giphy) => {
        let gifContainer = document.getElementById("gifContainer");
        let gif = document.createElement("img");
        gif.setAttribute("id", "gif");
        let src = randomInteger();
        gif.setAttribute("src", giphy.data[src].images.original.url);
        gifContainer.appendChild(gif);
        cnt_clicks = 0;
      });
    }
  }
});

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
  console.log(input);
  return input;
}
// the loadJSON function is borrowed from https://www.quora.com/How-do-I-load-a-true-JSON-file-using-pure-JavaScript
function loadJSON(filePath, success, error)
{
	let xhr = new XMLHttpRequest();

  let progressBar = document.getElementById("progress");

  xhr.onloadstart = function(e) {
    progressBar.value = 0.5;
  };

  xhr.onprogress = function(e) {
    if (e.lengthComputable) {
        progressBar.max = e.total;
        progressBar.value = e.loaded;
    }
  }
  xhr.onloadend = function(e) {
    progressBar.value = e.loaded;
  }
  	xhr.onreadystatechange = () =>
  	{
  		if (xhr.readyState === XMLHttpRequest.DONE) {
  			if (xhr.status === 200) {
  				if (success)
  					success(JSON.parse(xhr.responseText));
  		} else {
  			if (error)
  				error(xhr);
  			}
  		}
  	};
  	xhr.open("GET", filePath, true);
  	xhr.send();
}
