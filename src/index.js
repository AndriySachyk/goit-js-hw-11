import GalleryImages from './js/gallery.js';
import Notiflix from 'notiflix';
import LoadMoreBtn from './components/loadMoreBtn.js';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
/*
*Завдання 
1. Створити refs
2. Повісити слухачів
3. Підключити бібліотеки. 
4. З'єднати АРІ URL запити HTTP отримувати проміси  
5. Створити функцію яка буде читати проміс і повертати значення з бек енду 
6. Створити напопичувач макету markup 
7. отримувати дані з input підставляти в запит HTTP
8. Очищувати інпут після сабміт
9. Створити розмітку.
*/

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.getElementById('loadMore'),
};


const loadMoreBtn = new LoadMoreBtn({
  selector: "#loadMore",
  isHidden: true,
});
const galleryImages = new GalleryImages();


refs.form.addEventListener('submit', onSubmit)

refs.loadMoreBtn.addEventListener('click', fetchImages);

const totalHits = galleryImages.getGallery();


function onSubmit(even) {
    even.preventDefault()
    const form = even.currentTarget;
    const value = form.elements.searchQuery.value.trim();

    if (value === '') {
      Notiflix.Notify.warning('Please fill in the field');
    } else {
      
        galleryImages.searchQuery = value;
        galleryImages.resetPage();

        console.log(galleryImages.getGallery());
      loadMoreBtn.show();
      clearListImages();
      fetchImages().finally(() => form.reset());
    }
  
  
}


async function fetchImages() {
  loadMoreBtn.disable();
  
  try {
    const markup = await getImagesMarkup();
    if (!markup) throw new Error('No data');
    updateGalleryList(markup);
    
  } catch (err) {
    onError(err);
  }
  
  loadMoreBtn.enable();
}

async function getImagesMarkup() {
  try {
    const {hits, totalHits} = await galleryImages.getGallery();
    
    if (!hits) {
      loadMoreBtn.hide();
      return '';
    }
    if (hits.length === 0) throw new Error('No data');
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`
    );
    return hits.reduce((markup, image) => markup + createMarkup(image), '');
    } catch (err) {
      onError(err);
    }
  }
  
function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="280"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>: ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>: ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>: ${downloads}
    </p>
  </div>
</div>`;
}

function updateGalleryList(markup) {
    refs.gallery.insertAdjacentHTML("beforeend", markup);
  }
  

function onError(err) {
  console.error(err);
  loadMoreBtn.hide()
Notiflix.Notify.failure(
'Sorry, there are no images matching your search query. Please try again.'
);
}

function clearListImages() {
refs.gallery.innerHTML = ""
}





function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchImages();
  }
}

window.addEventListener("scroll", handleScroll);


