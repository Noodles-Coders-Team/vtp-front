import { useEffect, useState } from 'react';
import { type TemperatureDto } from '@nct/vtp-common';
import { fetchUserTemperature } from '../../api/temperature';
import { UserDropdown } from '../userSelectDropdown';

export function AllTemperatureTableWithUserFilter() {
    const [temperature, setTemperature] = useState<TemperatureDto[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [loadingTemperature, setLoadingTemperature] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId == '') return;

        console.log("user changed:", userId);
        loadTemperature(userId);
    }, [userId]);

    const reloadCurrentTemperature = async () => {
        await loadTemperature(userId);
    }

    const loadTemperature = async (userId: string) => {
        const id = parseInt(userId, 10);
        if (id == -1){
            setTemperature([]);
            return;
        }
        try {
            setLoadingTemperature(true);
            const data = await fetchUserTemperature(id);
            await setTemperature(data);
            setLoadingTemperature(false);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoadingTemperature(false);
        }
    };



    if (loadingTemperature && userId != '') return <p>Loading temperature...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading temperature: {error}</p>;

    if (!loadingTemperature && temperature.length === 0 && userId != '') return (
        <div>
            <p>No temperature found.</p>
            <UserDropdown value={userId} onChange={setUserId} />
        </div>
    );

    return (
        <div className="container text-center">
            <div className="row">
                <UserDropdown value={userId} onChange={setUserId} />
            </div>
            <div className="row">
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
                <button onClick={reloadCurrentTemperature} className="btn btn-secondary">Refresh Data</button>
            </div>
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