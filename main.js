// TODO: добавить возможность поиска по Enter
// TODO: стили
// TODO: find better random int func

const api = "https://api.giphy.com/v1/gifs/search?";
const apiKey = "&api_key=X1jZp2BrJcegW5PXBFPWn8v1RU557u6O";
const limit = "&limit=1000";
let query = "";

function randomInteger() {
  let rand = Math.random()*1000;
  return Math.floor(rand);
  }

let getGifBtn = document.getElementById("getGif");

getGifBtn.addEventListener("click", () => {
  let gif = document.getElementById("gif");
  if(gif !== null){
    gif.remove();
  };
  let input = getInput("search");
  query = setQuery(input);
  let url = api + query + apiKey + limit;
  //console.log(url);

  loadJSON(url, (giphy) => {
    let gifContainer = document.getElementById("gifContainer");
    let gif = document.createElement("img");
    let src = randomInteger();
    gif.setAttribute("id", "gif");
    gif.setAttribute("src", giphy.data[src].images.original.url);
    gif.setAttribute("width", "100%");
    gif.setAttribute("height", "100%");
    gifContainer.appendChild(gif);
});
});

function setQuery(content){
  content = content.replace(/\s/g, '-');
  return ""+`&q=${content}`;
}

function getInput(id) {
  let input = document.getElementById(id).value;
  return input;
}

// the loadJSON function is borrowed from https://www.quora.com/How-do-I-load-a-true-JSON-file-using-pure-JavaScript
function loadJSON(filePath, success, error)
{
	  let xhr = new XMLHttpRequest();
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
