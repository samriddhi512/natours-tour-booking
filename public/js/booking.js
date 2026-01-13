import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/bookings/tour/${tourId}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour booked successfully!');
      window.setTimeout(() => {
        location.assign('/my-tours');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
