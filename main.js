console.log('test');

const API_URL = 'https://api.waifu.pics/sfw/yeet';

async function requestImg(url) {
	const res = fetch(url);
	const data = (await res).json();

	return data;
}

async function refreshImage() {
	const animeImg = await requestImg(API_URL);	
	
	const img = document.getElementById('image');
	img.src = animeImg.url;

}

refreshImage();