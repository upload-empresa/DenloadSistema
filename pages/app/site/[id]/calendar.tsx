import { useEffect, useState } from 'react';

export default function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch('/api/events');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setEvents(data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchEvents();
    }, []);

    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map((event) => (
                    <p>{event.summary}</p>
                ))}

            </ul>
        </div>
    );
}
