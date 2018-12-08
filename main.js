const api = "https://api.giphy.com/v1/gifs/search?";
const apiKey = "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O";
const limit = "&limit=1000";
let query = "";

let getGifBtn = document.getElementById("getGif");
let searchForm = document.getElementById("form");
let searchInput = document.getElementById("search");

getGifBtn.addEventListener("click", (event) => {
  event.preventDefault();
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
  });
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

//   xhr.onprogress = function(event) {
//   console.log( 'Загружено на сервер ' + event.loaded + ' байт из ' + event.total );
// }
let progressBar = document.getElementById("progress");
// progressBar.style.visibility = "visible";
xhr.onloadstart = function(e) {
  progressBar.value = 0;
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
