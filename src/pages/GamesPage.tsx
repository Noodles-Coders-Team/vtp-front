import { eventBus } from "@/api/EventBus";
import { readGames } from "@/api/GamesApi";
import type { GameDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";

export default function GamesPage() {
    const [games, setGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadGames = async () => {
        try {
            setLoading(true);

            const games = await readGames();
            setGames(games);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        loadGames();
    }, []);

    useEffect(() => {
        eventBus.addEventListener('GameTableShouldBeRefreshed', loadGames);
        return () => {
            eventBus.removeEventListener('GameTableShouldBeRefreshed', loadGames);
        };
    }, []);

    if (loading) return <p>Loading games...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading games: {error}</p>;

    if (!loading && games.length === 0) return <p>No games found.</p>;

    return (
        <div style={{width: '50%', alignContent: 'center', marginLeft: 100}}>
            <h1> Games list</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Game Name</th>
                    </tr>
                </thead>

                <tbody>
                    {games.map((game) => (
                        <tr key={game.name}>
                            <td>{games.indexOf(game) + 1}</td>
                            <td>{game.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={loadGames} className="btn btn-secondary">Refresh Data</button>
        </div>
    )
}