const NUM_GIFS = 6;
const API_URL_BASE = 'https://api.waifu.pics/sfw';
const API_PATHS = [
	`/bonk`,
	`/yeet`,
	`/kick`,
	`/smile`,
	`/wave`,
	`/cry`,
];

async function requestGif(url) {
	const res = fetch(url);
	const data = (await res).json();
	return data;
}

const btnRefresh = document.getElementById('btnRefresh');
const gifsRecommended = document.getElementById('gifsRecommended');

for (let i = 1; i <= NUM_GIFS; i++) {
	let gif = 
	`<div class="gifBox">
		<img id="animeGif${i}" class="gif" alt="Anime GIF ${i}">
	</div>`;

	gifsRecommended.innerHTML += gif;
}

async function refreshGifs() {
	let historyGifs = [];

	for (let i = 1; i <= NUM_GIFS; i++) {
		const animeGif = document.getElementById(`animeGif${i}`);
		let randomIndexPath = Math.floor(Math.random() * API_PATHS.length);
		
		let response;
		do {
			response = await requestGif(`${API_URL_BASE}${API_PATHS[randomIndexPath]}`);
		} while (historyGifs.includes(response.url))
		
		historyGifs.push(response.url);
		
		animeGif.src = response.url;
		
		// gifBox.classList.remove('loading');
	}
}

refreshGifs();

// Event click refresh image
btnRefresh.addEventListener('click', () => {
	// gifBox.classList.add('loading');
	refreshGifs();
});