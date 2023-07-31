const NUM_GIFS = 6;

// Documentation: https://waifu.pics/docs
const API_URL_BASE = 'https://api.waifu.pics/sfw';
const API_PATHS = [
	'/bonk',
	'/yeet',
	'/kick',
	'/smile',
	'/wave',
	'/cry',
	'/highfive',
];

async function requestGif(url) {
	const res = fetch(url);
	return await res;
}

const btnRefresh = document.getElementById('btnRefresh');
const gifsRecommended = document.getElementById('gifsRecommended');

for (let i = 1; i <= NUM_GIFS; i++) {
	let gif = 
	`<div class="gifBox">
		<i class="unstar fa-regular fa-star fa-xl"></i>
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
			data = await response.json();
		} while (
			(BLACKLIST_GIFS.includes(data.url) || historyGifs.includes(data.url))
			&& response.ok
		)
		
		historyGifs.push(data.url);
		
		animeGif.src = data.url;
		
		// gifBox.classList.remove('loading');
	}
}

refreshGifs();

// Event click refresh image
btnRefresh.addEventListener('click', () => {
	// gifBox.classList.add('loading');
	refreshGifs();
});

const BLACKLIST_GIFS = [
	// no anime
	'https://i.waifu.pics/NJo1_Fd.gif', // bugs bunny
	'https://i.waifu.pics/8VSIwq1.gif', // lion king
	'https://i.waifu.pics/T4eQpMT.GIF', // lion king freezed
	'https://i.waifu.pics/DT5Cguw.gif', // bonk
	'https://i.waifu.pics/l3_ObDa.gif', // cartoon dog png
	'https://i.waifu.pics/AWDamwE.gif', // cartoon
	'https://i.waifu.pics/Mnw7eRk.gif', // sans yeet
	// very large
	'https://i.waifu.pics/0omhd79.gif',
	'https://i.waifu.pics/fwjX3GR.gif',
	'https://i.waifu.pics/T0gfAdU.gif',
	// others
	'https://i.waifu.pics/5S6AVgU.gif', // not safe
	'https://i.waifu.pics/X6tN050.GIF', // static gif
]