// SECTION - WebWorker to load all images
// @author LucaParenti <luca.parenti1@studenti.unimi.it>

// Load the correct WebWorker
const imagesLoader = new Worker('js/helpers/images-webworker.js');
const imgElements = document.querySelectorAll('img[data-src]');

// Calls postMessage() on WebWorker to load all images data
imgElements.forEach(element => {
  const URL = element.getAttribute('data-src');
  imagesLoader.postMessage(URL);
});

// Listen for the response from WebWorker and set all images properly
imagesLoader.addEventListener('message', (event) => {
  const data = event.data;

  const element = document.querySelector(`img[data-src='${data.URL}']`);
  
  const url = URL.createObjectURL(data.blob);

  element.setAttribute('src', url);
  element.removeAttribute('data-src');
});