import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './booking';
import { displayMap } from './leaflet';
import { submitReview, deleteReview } from './review';

// Get locations from the map element's dataset and initialize the map

// DOM elements
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const reviewForm = document.getElementById('review-form');

if (mapElement && mapElement.dataset.locations) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { tourId } = reviewForm.dataset;
    const review = document.getElementById('review').value;
    const ratingSelect = document.getElementById('rating');
    
    if (!ratingSelect || !ratingSelect.value) {
      alert('Please select a rating');
      return;
    }
    
    const rating = ratingSelect.value;
    submitReview(tourId, review, rating);
  });
}

// Delete review buttons
const deleteReviewBtns = document.querySelectorAll('.btn-delete-review');
if (deleteReviewBtns) {
  deleteReviewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { reviewId } = e.target.dataset;
      if (confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
      }
    });
  });
}
