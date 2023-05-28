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

refs.loadMoreBtn.addEventListener('click', onLoadMore);



async function onSubmit(even) {
  even.preventDefault();
  const form = even.currentTarget
  const value = form.elements.searchQuery.value.trim();
  galleryImages.searchQuery = value
  galleryImages.resetPage()
  clearGalleryList();
  loadMoreBtn.show();

  
  if (!galleryImages.searchQuery) {
    Notiflix.Notify.warning('Please fill in this field');
    loadMoreBtn.hide()
    return 
  }
  try {
    const result = await galleryImages.getGallery().finally(()=> form.reset());
    
    console.log(result);
    if (result.hits) {
      createMarkup(result)
      loadMoreBtn.enable();
      
    }

  message(result)
  } catch (err) {
    onError(err);
  }
}

function createMarkup(result) {
  const markup = result.hits.reduce(
    (markup, image) => markup + createGalleryItem(image),
    ''
  );
  
  
  updateMarkup(markup);
  
}


function message(result) {
  if (result.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.hide()
    console.log('hello');
    return 
    }
    if (result.totalHits >= result.hits.length ) {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
    }

}


function createGalleryItem({ webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,}) {
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


function updateMarkup(markup) {
  
  refs.gallery.insertAdjacentHTML('beforeend', markup);
    
}


function clearGalleryList() {
  refs.gallery.innerHTML = " "
  loadMoreBtn.hide();
}


//  function onLoadMore() {
  
 
  
   
//   addItemGallery();



// }


async function onLoadMore() {
  try {
    loadMoreBtn.disable();
    const result = await galleryImages.getGallery();
    theEnd();
    createMarkup(result);
    console.log(result);
  } catch (err) {
    onError(err);

    loadMoreBtn.end();
  }

}



function theEnd() {
   const totalHits = Math.round(result.totalHits / galleryImages.perPage);
    const thisPage = galleryImages.page;
    
    loadMoreBtn.enable();
    
    if (thisPage > totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.end();
        return 
    }
}



function onError(err) {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  console.error(err)
}