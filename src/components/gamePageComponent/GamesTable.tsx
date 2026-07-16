import { eventBus } from "@/api/EventBus";
import { readGamesWithInfo } from "@/api/GamesApi";
import type { GameWithInfoDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";

export default function GamesTable() {

    const [games, setGames] = useState<GameWithInfoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //Custom filters
    const [can_record, setCanRecord] = useState<boolean | null>(null);
    const [discussed, setDiscussed] = useState<boolean | null>(null);

    const switchBoolean = (column: string) => {
        console.log('Updating: ' + column.toString());
        if (column == BooleanColumn.can_record) {
            switchFilter(can_record, setCanRecord);
        }
        else {
            switchFilter(discussed, setDiscussed);
        }

        loadGames();
    }

    const switchFilter = (value: boolean | null, onChange: (valuse: boolean | null) => void) => {
        if (value === null)
            onChange(true);
        else if (value)
            onChange(false);
        else
            onChange(null);
    }

    const loadGames = async () => {
        try {
            setLoading(true);

            const games = await readGamesWithInfo(can_record, discussed);
            setGames(games);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        };
    };

    const getColorByBool = (value: boolean | null): string => {
        if (value === null)
            return "white";
        else if (value)
            return "green";
        else
            return "red";
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
        <div>
            <h1> Games list</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Game Name</th>
                        <th scope="col" style={{backgroundColor: getColorByBool(can_record) }} onClick={() => { switchBoolean(BooleanColumn.can_record) }}>Can Record</th>
                        <th scope="col" style={{backgroundColor: getColorByBool(discussed) }} onClick={() => { switchBoolean(BooleanColumn.discussed) }}>Discussed</th>
                    </tr>
                </thead>

                <tbody>
                    {games.map((game) => (
                        <tr key={game.name}>
                            <td>{games.indexOf(game) + 1}</td>
                            <td>{game.name}</td>
                            <td>{game.game_info.can_record ? 'X' : ''}</td>
                            <td>{game.game_info.discussed ? 'X' : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={loadGames} className="btn btn-secondary">Refresh Data</button>
        </div>
    )
}

const BooleanColumn = {
    can_record: 'can_record',
    discussed: 'discussed'
}
