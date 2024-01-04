import fetch from 'node-fetch';
import * as notifier from 'node-notifier';

const getReservationList = async () => {
  // NOTE: NEED TO ADD THE APPROPRIATE COOKIE HERE.
  // Can be found by checking the network tab in chrome dev tools
  // and using copy as node.js fetch.
  const response = await fetch(
    'https://account.ikonpass.com/api/v2/reservation-availability/88',
  );

  if (!response.ok) {
    console.log('GOT AN ERROR');
    notifier.default.notify({
      title: 'PROGRAM STOPPED RUNNING!!!',
      message:
        'Go to https://account.ikonpass.com/myaccount/reservations/add/',
    });
  }

  const data = await response.json();
  let saturdayAvailable = true;
  let sundayAvailable = true;
  for (const reservationList of data.data) {
    if (reservationList.unavailable_dates.includes('2024-01-06')) {
      saturdayAvailable = false;
    }
    if (reservationList.unavailable_dates.includes('2024-01-07')) {
      sundayAvailable = false;
    }
  }

  if (saturdayAvailable || sundayAvailable) {
    console.log('DATE AVAILABLE!!!', saturdayAvailable, sundayAvailable);
    const message = saturdayAvailable
      ? 'Saturday is available!'
      : 'Sunday is available!';
    notifier.default.notify({
      title: 'DATE AVAILABLE!!! ' + message,
      message:
        'Go to https://account.ikonpass.com/myaccount/reservations/add/',
    });
  } else {
    console.log('Date not available!');
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  while (true) {
    await sleep(1000);
    await getReservationList();
  }
})();
