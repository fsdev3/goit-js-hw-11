// import { onSubmit } from './pic-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
form.addEventListener('submit', onSubmit);
const axios = require('axios').default;
const galleryItems = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37263495-0dc17f57687021d8824007ffe';

function onSubmit(event) {
  event.preventDefault();
  const inputValue = searchQuery.value;
  searchImg(inputValue);
}

function searchImg(inputValue) {
  return axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    })
    .then(response => {
      const objectsResponse = response.data.hits;
      createGalleryItems(objectsResponse);
      console.log(objectsResponse);
      if (objectsResponse.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
}

function createGalleryItems(objectsResponse) {
  const galleryHTML = objectsResponse
    .map(
      item => `<div class="gallery__item">
  <a class="gallery__link" href="${item.largeImageURL}">
  <img class="gallery__image" src="${item.previewURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${item.downloads}</b>
    </p>
  </div>
  </div></a>
`
    )
    .join('');

  galleryItems.insertAdjacentHTML('beforeend', galleryHTML);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
    captionsData: 'alt',
  });
}
