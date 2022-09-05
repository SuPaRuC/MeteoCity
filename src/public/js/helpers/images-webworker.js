// WebWorker to load all images.
// @author LucaParenti <luca.parenti1@studenti.unimi.it>

// Listen for elements passed from homepage, loads all data & reply.
self.addEventListener('message', async (event) => {
  const URL = event.data;

  const response = await fetch(`${URL}`);
  const blob = await response.blob();

  self.postMessage({
    URL: URL,
    blob: blob,
  });
});