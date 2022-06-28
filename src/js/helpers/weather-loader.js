async function validator (url) {
  const response = await fetch(url);
  return response.ok ? response.json() : Promise.reject({ error: 500 });
};

async function getCityWeatherInfo (city) {
  try {
      const weatherResponse = await validator(`/api/v1/getCityWeather/${city}`);
      console.log(weatherResponse.main)
  } catch (err) {
      console.log(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCityWeatherInfo("Milano");
});