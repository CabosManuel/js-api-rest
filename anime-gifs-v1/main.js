
const API_URL_BASE = 'https://api.waifu.pics/sfw';
const API_URLS = [
	`${API_URL_BASE}/bonk`,
	`${API_URL_BASE}/yeet`,
	`${API_URL_BASE}/kick`,
	`${API_URL_BASE}/smile`,
	`${API_URL_BASE}/wave`,
];

async function requestImg(url) {
	const res = fetch(url);
	const data = (await res).json();
	return data;
}

const img = document.getElementById('image');
const btnRefresh = document.getElementById('btnRefresh');
const imgContainer = document.getElementById('imgContainer');

async function refreshImage() {
	const animeImg = await requestImg(API_URLS[Math.floor(Math.random() * API_URLS.length)]);	
	img.src = animeImg.url;

	imgContainer.classList.remove('loading');
}

refreshImage();

// Event click refresh image
btnRefresh.addEventListener('click', () => {
	imgContainer.classList.add('loading');
	refreshImage();
});