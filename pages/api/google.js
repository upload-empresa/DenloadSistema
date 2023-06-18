import { google } from 'googleapis';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { formatISO } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

// Google calendar API settings
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const calendar = google.calendar({ version: 'v3' });

// Configurações do Google OAuth2
const GOOGLE_CLIENT_ID =
  '197452502170-ltu7rb9gh5uiea2th6ddsk2211qojlkf.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_CALLBACK_URL = 'http://localhost:3000/agenda'; // URL de retorno após o login
const CALENDAR_ID =
  'b07255c2775043c83d7ce921b4fad70cf265dc5dd60936b48327d9bb663975a2@group.calendar.google.com';

// Inicialize o Passport.js
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       scope: SCOPES,
//       callbackURL: GOOGLE_CALLBACK_URL,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Salve as credenciais de acesso do usuário no banco de dados ou em uma sessão
//       // Você pode armazenar accessToken e refreshToken para uso posterior
//       const userCredentials = {
//         accessToken,
//         refreshToken,
//       };
//       return done(null, userCredentials);
//     }
//   )
// );

// Função auxiliar para obter as credenciais de acesso do usuário
const getAuthClient = (credentials) => {
  const { accessToken, refreshToken } = credentials;

  const authClient = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );
  authClient.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return authClient;
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    passport.authenticate('google', { scope: SCOPES })(req, res);
  } else {
    passport.authenticate(
      'google',
      { failureRedirect: '/login' },
      (err, userCredentials) => {
        if (err) {
          console.error('Erro de autenticação:', err);
          return res.status(500).send('Erro de autenticação');
        }

        // Crie o cliente de autenticação usando as credenciais do usuário
        const authClient = getAuthClient(userCredentials);

        // Faça uma chamada para a API do Google Calendar para obter todos os eventos
        calendar.events.list(
          {
            auth: authClient,
            calendarId: CALENDAR_ID,
          },
          (err, response) => {
            if (err) {
              console.error('Erro ao obter os eventos da agenda:', err);
              return res.status(500).send('Erro ao obter os eventos da agenda');
            }

            const events = response.data.items; // Lista de eventos

            // Faça algo com os eventos, como exibi-los no front-end
            console.log(events);

            res.status(200).json(events);
          }
        );
      }
    )(req, res);
  }
}
