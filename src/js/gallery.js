import axios from 'axios';

const API_KEY = '36732320-36b39292b107cb29c68f7e6f5';
const URL = 'https://pixabay.com/api/';


export default class GalleryImages {
  constructor() {
    this.page = 0;
    this.searchQury = '';
    this.perPage = 40
  }

  async getGallery() {
    const gallery = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}`
    );
    this.incrementPage();
    const galleryHits = gallery.data; 
    // console.log(gallery.data);
    return galleryHits;
  }


  resetPage() {
   return this.page = 1;
  }

  incrementPage() {
   return  this.page += 1;
  }
}