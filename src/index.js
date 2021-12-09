import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const axios = require('axios');

const API_KEY = '24701819-0d7586ce1f39ad56fcdaf1d5e';
const PER_PAGE = 40;
let page = 1;
let searchKey;
let pageAmount;

const searchBtn = document.querySelector('button[type=submit]');
const searchInput = document.querySelector('input[name=searchQuery]');
const gallery = document.querySelector('.gallery');
// Доступ до кнопки "Load more"
// const loadMoreBtn = document.querySelector('.load-more');

const lightbox = event => {
    event.preventDefault();
    new SimpleLightbox('.gallery a',
        {
            captionsData: 'alt',
            captionDelay: 250
        }
    );
};

const getRequest = () => {
    // await axios.get('https://pixabay.com/api', {
    //     params: {
    //         key: API_KEY,
    //         q: searchInput.value,
    //         image_type: 'photo',
    //         orientation: 'horizontal',
    //         safesearch: true,
    //         page: page,
    //         per_page: PER_PAGE,
    //     }

    // const searchParams = new URLSearchParams({
    //         key: API_KEY,
    //         q: searchInput.value,
    //         image_type: 'photo',
    //         orientation: 'horizontal',
    //         safesearch: true,
    //         page: page,
    //         per_page: PER_PAGE,
    // });

    // const url = `https://pixabay.com/api?${searchParams}`;
    // console.log(url);
    fetch('https://pixabay.com/api?key=24701819-0d7586ce1f39ad56fcdaf1d5e&q=&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const totalHits = data.totalHits;
            console.log(totalHits);
            const arrayImg = data.hits;
            pageAmount = Math.ceil(totalHits / PER_PAGE);
    
            if (arrayImg.length === 0) {
                page = 1;
                searchInput.value = '';
                return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            };
    
            if (page === 1) {
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            };

            const galleryItems = arrayImg.map(item => {
                return `<div class="photo-card">
                    <a href="${item.largeImageURL}">
                        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
                    </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            <span>${item.likes}</span>
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            <span>${item.views}</span>
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            <span>${item.comments}</span>
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            <span>${item.downloads}</span>
                        </p>
                    </div>
                </div>`;
            })
            .join('');
            gallery.insertAdjacentHTML('beforeend', galleryItems);

            if (page === Math.ceil(totalHits / PER_PAGE)) {
                // Приховує кнопку "Load more", якщо відображені усі зображення за запитом
                // loadMoreBtn.style.display = 'none';
                return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            };
    
            // Плавний скроллінг сторінки вверх при натисканні кнопки "Load more"
            // if (page > 1) {
            //     const { height: cardHeight } = gallery
            //         .firstElementChild.getBoundingClientRect();

            //     window.scrollBy({
            //         top: cardHeight * 2,
            //         behavior: "smooth",
            //     });
            // };
        
            // Поява кнопки "Load more"
            // loadMoreBtn.style.display = 'inline-block';
    
        })
        .catch(function (error) {
            console.log(error);
        })
};

searchBtn.addEventListener('click', event => {
    event.preventDefault();

    if (searchInput.value === searchKey) return;

    if (searchInput.value !== searchKey) {
        page = 1;
        searchKey = searchInput.value;
    };

    // Приховує кнопку "Load more" при новому пошуковому запиті
    // loadMoreBtn.style.display = 'none';
    gallery.innerHTML = '';
    getRequest();
});

const infinityScroll = () => {
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    if (page === pageAmount) return;
    if (windowRelativeBottom < document.documentElement.clientHeight * 2) {
        page += 1;
        getRequest();
    };
};

window.addEventListener('scroll',
    debounce(
        infinityScroll,
        150,
    )
);

gallery.addEventListener('click', lightbox);

// Запит на нову групу зображень при натисканні кнопки "Load more"
// loadMoreBtn.addEventListener('click', () => {
//     page += 1;
//     getRequest();
// });