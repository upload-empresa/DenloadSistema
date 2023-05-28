import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:3001');
    const eventData = response.data;

    const event = {
      id: 1, // Você pode atribuir um ID adequado aqui
      summary: eventData,
      start: new Date().toISOString(), // Pode usar a data atual ou ajustar conforme necessário
    };

    const formattedEvents = [event];

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}
