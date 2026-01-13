const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  // Get the tour to get its price
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Check if user already booked this tour
  const existingBooking = await Booking.findOne({
    tour: tourId,
    user: req.user.id,
  });

  if (existingBooking) {
    return next(new AppError('You have already booked this tour!', 400));
  }

  // Create booking
  const booking = await Booking.create({
    tour: tourId,
    user: req.user.id,
    price: tour.price,
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Admin routes using factory
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBookingAdmin = factory.deleteOne(Booking);
