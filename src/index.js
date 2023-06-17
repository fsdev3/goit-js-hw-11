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
let totalUserHits = 0;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37263495-0dc17f57687021d8824007ffe';

function onSubmit(event) {
  event.preventDefault();
  cleanPrevious();

  const inputValue = searchQuery.value;
  searchImg(inputValue, pageNumber);
}

function cleanPrevious() {
  galleryItems.innerHTML = '';
  pageNumber = 1;
  totalUserHits = 0;
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
      let userHits = objectsResponse.length;
      const totalHits = response.data.totalHits;
      console.log(objectsResponse.length);
      countHits(userHits, totalHits);
      if (objectsResponse.length === 0 || totalUserHits >= totalHits) {
        toggleHidden(loadMoreBtn, 'add');
      } else {
        toggleHidden(loadMoreBtn, 'remove');
      }
      if (objectsResponse.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (page <= 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      pageNumber = page;
    });
}

function countHits(userHits, totalHits) {
  totalUserHits += userHits;
  if (totalUserHits > totalHits) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
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
    widthRatio: 0.65,
  });
  lightbox.refresh();
}

loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore(event) {
  event.preventDefault();
  searchImg(searchQuery.value, pageNumber + 1);
  toggleHidden(loadMoreBtn, 'add');
  setTimeout(smoothScroll, 300);
}

function toggleHidden(elem, m = 'add') {
  elem.classList[m]('hidden');
}

function smoothScroll() {
  window.scrollBy({
    top: window.innerHeight / 1.03,
    behavior: 'smooth',
  });
}
