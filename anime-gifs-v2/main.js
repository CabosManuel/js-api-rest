const NUM_GIFS = 4;
const MAX_FAVORITES = 2;

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
		<i class="unstar fa-solid fa-star fa-xl"></i>
		<img id="animeGif${i}" class="gif" alt="Anime GIF ${i}">
	</div>`;

	gifsRecommended.innerHTML += gif;
}

// TODO: Hacer que se carguen todas al mismo tiempo y no una por una
async function refreshGifs() {
	let historyGifs = [];

	for (let i = 1; i <= NUM_GIFS; i++) {
		const animeGif = document.getElementById(`animeGif${i}`);
		let randomIndexPath = Math.floor(Math.random() * API_PATHS.length);
		
		let response;
		do {
			response = await requestGif(`${API_URL_BASE}${API_PATHS[randomIndexPath]}`);
			data = await response.json();
		} while ( (BLACKLIST_GIFS.includes(data.url) || historyGifs.includes(data.url)) && response.ok )
		
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


let unstarBtnsRecommended = gifsRecommended.querySelectorAll('.unstar');
let starBtnsRecommended = gifsRecommended.querySelectorAll('.star');
console.log('unstar',unstarBtnsRecommended);
console.log('star',starBtnsRecommended);

addListenerFavoriteBtns();

function addListenerFavoriteBtns() {
	unstarBtnsRecommended.forEach(favBtn => {
		favBtn.addEventListener('click', () => {
			const parentDiv = favBtn.closest('div');
			// console.log(parentDiv);
			
			const gif = parentDiv.querySelector('img');
			// console.log('ID de la imagen:', gif.id);
			
			
			if(favBtn.classList.contains('unstar')) {
				addToFavorites(gif);
			} else if (favBtn.classList.contains('star')) {
				removeFromFavorites(gif);
			}
			
			// FIXME: Al intentar agregar a favorito y si es más del máximo,
			// no lo agregar, pero sí modifica el estilo de la estrella	bloqueando el botón
			favBtn.classList.toggle('unstar');
			favBtn.classList.toggle('star');
		});
	});
}

// FAVORITES --------------------------------------------------
const gifsFavorites = document.getElementById("gifsFavorites");
let gifsFavoritesList = [];

function addToFavorites(imgGif) {
	// console.log(gifsFavorites);
	console.log(imgGif);
	// console.log(imgGif.src);
	
	if (validateDuplicatesAndMaxFavoritesSection(imgGif)) {
		let gifFavorite =
		`<div class="gifBox">
		<img id="${imgGif.id}" src="${imgGif.src}" class="gif" alt="${imgGif.alt}">
		</div>`;
		
		gifsFavorites.innerHTML += gifFavorite;
		
		gifsFavoritesList.push(imgGif);
	}
}

function removeFromFavorites(imgGif) {
	const imgGifFavorite = gifsFavorites.querySelector(`#${imgGif.id}`);
	const imgGifFavoriteContainer = imgGifFavorite.closest('div');
	imgGifFavoriteContainer.remove();
	
	console.log('gifsFavoritesList before: ', gifsFavoritesList);
	let indexToDelete = gifsFavoritesList.indexOf(imgGif);
	gifsFavoritesList.splice(indexToDelete, 1);
	console.log('gif removed: ', imgGifFavoriteContainer);
	console.log('gifsFavoritesList after: ', gifsFavoritesList);
}

function validateDuplicatesAndMaxFavoritesSection(imgGif) {
	let nFavorites = gifsFavorites.querySelectorAll('img').length;
	return nFavorites < MAX_FAVORITES && !gifsFavoritesList.includes(imgGif);
}

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
	'https://i.waifu.pics/gGX~reJ.gif',
	// others
	'https://i.waifu.pics/gwNlL3Q.gif', // duplicate
	'https://i.waifu.pics/5S6AVgU.gif', // not safe
	'https://i.waifu.pics/X6tN050.GIF', // static gif
]