import { useEffect, useState } from 'react';
import { type TemperatureDto } from '@nct/weather-common';
import { eventBus } from '../../api/eventBus';
import { fetchAllTemperature } from '../../api/temperature';

export function AllTemperatureTable() {
    const [temperature, setTemperature] = useState<TemperatureDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadTemperature = async () => {
        try {
            setLoading(true);

            const data = await fetchAllTemperature();
            setTemperature(data);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Runs once on page load
    useEffect(() => {
        loadTemperature();
    }, []);

    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener('temperatureHasBeenCreated', loadTemperature);
        return () => {
            eventBus.removeEventListener('temperatureHasBeenCreated', loadTemperature);
        };
    }, []);

    if (loading) return <p>Loading temperature...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading teperature: {error}</p>;

    if (!loading && temperature.length === 0) return <p>No temperature found.</p>;

    return (
        <div>
            <h2> Temperature list</h2>
            <table border={1} cellPadding={0} className="table table-striped">
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Time</th>
                        <th>Inside</th>
                        <th>Outside</th>
                    </tr>
                </thead>

                <tbody>
                    {temperature.map((temperature) => (
                        <tr key={temperature.id}>
                            <td>{temperature.user_id}</td>
                            <td>
                                {formatDate(temperature.time)}
                            </td>
                            <td>{temperature.inside}</td>
                            <td>{temperature.outside}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={loadTemperature} className="btn btn-secondary">Refresh Data</button>
        </div>
    );

}

function formatDate(date: string): string {
    return new Date(date).toLocaleString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}