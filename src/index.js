// import { onSubmit } from './pic-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
form.addEventListener('submit', onSubmit);
const axios = require('axios').default;
const galleryItems = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let pageNumber = 1;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37263495-0dc17f57687021d8824007ffe';

function onSubmit(event) {
  event.preventDefault();
  galleryItems.innerHTML = '';
  pageNumber = 1;

  const inputValue = searchQuery.value;
  searchImg(inputValue, pageNumber);
}

function searchImg(inputValue, page) {
  return axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: page,
      },
    })
    .then(response => {
      let objectsResponse = response.data.hits;
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
    .finally(function () {
      pageNumber = page;
    });
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
  toggleHidden(loadMoreBtn, 'remove');

  let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
    captionsData: 'alt',
  });
}

function toggleHidden(elem, m = 'add') {
  elem.classList[m]('hidden');
}

loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore(event) {
  event.preventDefault();
  searchImg(searchQuery.value, pageNumber + 1);
}
