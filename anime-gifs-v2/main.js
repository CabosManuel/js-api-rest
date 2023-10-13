const RECOMMENDED_GIFS = 12;
const MAX_FAVORITES = 4;
const MAX_NOTIFICATIONS = 3;

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

for (let i = 1; i <= RECOMMENDED_GIFS; i++) {
	let gif = 
	`<div class="gifBox">
		
		<div id="loader${i}" class="loader-box">
			<span class="loader"></span>
		</div>

		<i class="unstar fa-solid fa-star fa-xl"></i>
		<img id="animeGif${i}" class="gif" alt="Anime GIF ${i}">
	</div>`;

	gifsRecommended.innerHTML += gif;
}

// First reload gifs
refreshRecommendedGifs();

async function refreshRecommendedGifs() {
	let historyGifs = [];

	// Block btnRefresh
	toggleDisabledBtnRefresh();

	showAllImgLoaders();

	for (let i = 1; i <= RECOMMENDED_GIFS; i++) {
		
		const gifContainer = document.getElementById(`animeGif${i}`);
		
		// Get random gif
		let randomIndexPath = Math.floor(Math.random() * API_PATHS.length);
		let response;
		do {
			response = await requestGif(`${API_URL_BASE}${API_PATHS[randomIndexPath]}`);
			data = await response.json();
		} while ( (BLACKLIST_GIFS.includes(data.url) || historyGifs.includes(data.url)) && response.ok )
		
		// Set gif in container
		gifContainer.src = data.url;

		// Save in history
		historyGifs.push(data.url);
		
		// Hide loader animation
		hideLoaderImg(i);

		// Active btnRefresh when last gif is set, wait 1seg
		if (gifContainer.src && i === RECOMMENDED_GIFS) {
			setTimeout(() => {
				toggleDisabledBtnRefresh();
			}, 1000);
		}
	}
}

function showAllImgLoaders() {
	const allLoaders = document.querySelectorAll('.loader-box');
	
	allLoaders.forEach(loader => {
		loader.style.display = 'flex';
	});
}

function hideLoaderImg(i) {
	const loader = document.getElementById(`loader${i}`);
	
	// When is visible (flex), wait 0.6 seg and hide loader
	if (loader.style.display === 'flex') {
		setTimeout(() => {
			loader.style.display = 'none';
		}, 600);
	}
}
 
function toggleDisabledBtnRefresh() {
	const btnRefresh = document.getElementById('btnRefresh');
	const green = '#058c42';
	const darkGreen = '#04471c';
	const white = '#eff6e0';

	if (btnRefresh.disabled) {
		btnRefresh.disabled = false;
		btnRefresh.style.backgroundColor = green;
		btnRefresh.style.color = white;
		btnRefresh.style.cursor = 'pointer';
	} else {
		btnRefresh.disabled = true;
		btnRefresh.style.backgroundColor = darkGreen;
		btnRefresh.style.color = 'grey';
		btnRefresh.style.cursor = 'not-allowed';
	}
}

// Event click btnRefresh
btnRefresh.addEventListener('click', () => {
	console.log('click');
	refreshRecommendedGifs();
	resetStarButtonsAndFavoritesImgs();
});

// STAR BUTTONS --------------------------------------------------------
let unstarBtnsRecommended = gifsRecommended.querySelectorAll('.unstar');
let starBtnsRecommended = gifsRecommended.querySelectorAll('.star');

addListenerFavoriteBtns();

function addListenerFavoriteBtns() {
	unstarBtnsRecommended.forEach(favBtn => {
		favBtn.addEventListener('click', () => {
			const parentDiv = favBtn.closest('div');
			const gif = parentDiv.querySelector('img');
			
			if(favBtn.classList.contains('unstar') && validateMaxFavorites()) {
				addToFavorites(gif);
				favBtn.classList.toggle('unstar');
				favBtn.classList.toggle('star');
			} else if (favBtn.classList.contains('star')) {
				removeFromFavorites(gif);
				favBtn.classList.toggle('unstar');
				favBtn.classList.toggle('star');
			}
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
	
	if (validateDuplicatesFavorites(imgGif) && validateMaxFavorites()) {
		let gifFavorite =
		`<div class="gifBox">
		<img id="${imgGif.id}" src="${imgGif.src}" class="gif" alt="${imgGif.alt}">
		</div>`;
		
		gifsFavorites.innerHTML += gifFavorite;
		
		gifsFavoritesList.push(imgGif);
	}

	toggleHelpText();
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
	
	toggleHelpText();
}

function resetStarButtonsAndFavoritesImgs() {
	const starsBtn = document.querySelectorAll('.star');
	starsBtn.forEach(starBtn => {
		starBtn.classList.toggle('star');
		starBtn.classList.toggle('unstar');
	});

	const gifs = gifsFavorites.querySelectorAll('img');
	
	// Cuando haya al menos 1 en la sección Favorites
	if (gifs.length > 0){
		gifs.forEach(gif => {
			removeFromFavorites(gif);
		});
		toggleHelpText();
	}
}

// Hide help text in Favorites section
function toggleHelpText() {
	const helpText = document.querySelector('.favoritesHelp');
	const nFavorites = gifsFavorites.querySelectorAll('img').length;

	if (nFavorites > 0 && helpText.style.display !== 'none')
		helpText.style.display = 'none';
	else if (nFavorites === 0 && helpText.style.display === 'none')
		helpText.style.display = 'block';
}

// VALIDATIONS ---------------------------------------------------
function validateDuplicatesFavorites(imgGif) {
	return !gifsFavoritesList.includes(imgGif);
}

function validateMaxFavorites() {
	let nFavorites = gifsFavorites.querySelectorAll('img').length;
	let isLessThanMaxFavorites = nFavorites < MAX_FAVORITES;
	if (!isLessThanMaxFavorites) newNotification(MSG_MAX_FAVORITES, TYPE_ERROR);

	return isLessThanMaxFavorites;
}

// NOTIFICATIONS ----------------------------------------------
const TYPE_ERROR = 'error';
const TYPE_WARNING = 'warning';

const MSG_MAX_FAVORITES =
`<p class="message error">
	<i class="fa-solid fa-lg fa-triangle-exclamation"></i>
	Maximum only ${MAX_FAVORITES} favorites
</p>`;

const notificationsContainer = document.querySelector('.notifications');

function newNotification(msg, type) {
	const notification = document.createElement('div');
	notification.classList.add('notification');
	notification.classList.add(type);
	notification.innerHTML = msg;

	notificationsContainer.appendChild(notification);

	// Forzar "reflow", recalcula y aplicar estilos .notification
	void notification.offsetWidth;

	notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)'; // Bajarlo y mostrarlo
	
	setTimeout(() => {
		notification.style.opacity = '0';
		notification.style.transform = 'translateY(-100%)'; // Subirlo fuera de la pantalla
		
		setTimeout(() => {
			notification.remove();
		}, 600);
	}, 4000);

	if (notificationsContainer.children.length > MAX_NOTIFICATIONS) {
		notificationsContainer.removeChild(notificationsContainer.children[0]);
	}
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
	'https://i.waifu.pics/ve8lHum.gif', // duplicate kick 1
	'https://i.waifu.pics/xaZig9L.gif', // duplicate kick 2
	'https://i.waifu.pics/5S6AVgU.gif', // not safe
	'https://i.waifu.pics/X6tN050.GIF', // static gif
	'https://i.waifu.pics/JvYGKhE.gif', // broken gif
]