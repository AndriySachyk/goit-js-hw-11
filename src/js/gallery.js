import axios from 'axios';

const API_KEY = '36732320-36b39292b107cb29c68f7e6f5';
const URL = 'https://pixabay.com/api/';


export default class GalleryImages {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
 
  }

  async getGallery() {
    const gallery = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}`
    );
    this.incrementPage();
    const galleryHits = gallery.data; 
    console.log(gallery.data);
    return galleryHits;
  }


  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}