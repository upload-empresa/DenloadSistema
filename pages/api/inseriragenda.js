import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { formatISO } from 'date-fns';

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '-03:00';

// Get date-time string for calendar
const dateTimeForCalendar = () => {
  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

  let event = new Date(Date.parse(newDateTime));

  let startDate = event;
  // Delay in end time is 1
  let endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + 1)
  );

  return {
    start: startDate,
    end: endDate,
  };
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {
  try {
    let response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      resource: event,
    });

    if (response['status'] == 200 && response['statusText'] === 'OK') {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

console.log(dateTimeForCalendar());

let dateTime = dateTimeForCalendar();

export default async function handler(req, res) {
  const { summary, description, daystart, dayend } = req.body;
  const formattedStart = formatISO(new Date(daystart));
  const formattedEnd = formatISO(new Date(dayend));

  // Event for Google Calendar
  let event = {
    summary: summary,
    description: description,
    start: {
      dateTime: formattedStart,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: formattedEnd,
      timeZone: 'America/Sao_Paulo',
    },
  };

  insertEvent(event)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Delete an event from eventID

// const deleteEvent = async (eventId) => {
//   try {
//     let response = await calendar.events.delete({
//       auth: auth,
//       calendarId: calendarId,
//       eventId: eventId,
//     });

//     if (response.data === '') {
//       return 1;
//     } else {
//       return 0;
//     }
//   } catch (error) {
//     console.log(`Error at deleteEvent --> ${error}`);
//     return 0;
//   }
// };

// let eventId = '59obkne2tuvbdu8dk13ioh7s8c';

// deleteEvent(eventId)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
