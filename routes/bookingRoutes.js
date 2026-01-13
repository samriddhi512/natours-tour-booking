const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// All routes below require authentication
router.use(authController.protect);

// User routes
router.post('/tour/:tourId', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.delete('/:id', bookingController.deleteBooking);

// Admin routes
router.use(authController.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getAllBookings);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBookingAdmin);

module.exports = router;
