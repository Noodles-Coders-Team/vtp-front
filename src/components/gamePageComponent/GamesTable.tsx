import { eventBus } from "@/api/EventBus";
import { readGamesWithInfo } from "@/api/GamesApi";
import type { GameWithInfoDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";
import { TableColumnNameBooleanFilter } from "../commonComponents/TableColumnNameBooleanFilter";
import iconTrue from '@assets/check_box_64.svg';
import iconFalse from '@assets/check_box_empty_64.svg';

const tableIconSize = 32;

export default function GamesTable() {

    const [games, setGames] = useState<GameWithInfoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //Custom filters
    const [can_record, setCanRecord] = useState<boolean | null>(null);
    const [discussed, setDiscussed] = useState<boolean | null>(null);


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

    useEffect(() => {
        loadGames();
    }, []);

    useEffect(() => {
        loadGames();
    }, [can_record, discussed]);

    useEffect(() => {
        eventBus.addEventListener('GameTableShouldBeRefreshed', loadGames);
        return () => {
            eventBus.removeEventListener('GameTableShouldBeRefreshed', loadGames);
        };
    }, []);

    if (loading) return <p>Loading games...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading games: {error}</p>;

    // if (!loading && games.length === 0) return setGames([]);

    return (
        <div className='card'>
            <div className='card-body'>
                <h5 className='card-title'>Games list</h5>
                <div className="overflow-y-scroll" style={{ height: 500 }}>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" style={{ width: '50%', textAlign: 'left' }}>Game Name</th>
                                <TableColumnNameBooleanFilter label="Can Record" value={can_record} onChange={setCanRecord} />
                                <TableColumnNameBooleanFilter label="Discussed" value={discussed} onChange={setDiscussed} />
                                <th scope="col">Notes</th>
                            </tr>
                        </thead>

                        <tbody>
                            {games.map((game) => (
                                <tr key={game.name}>
                                    <td>{games.indexOf(game) + 1}</td>
                                    <td>{game.name}</td>
                                    <td style={{ alignContent: 'center', textAlign: 'center' }}><img src={game.game_info.can_record ? iconTrue : iconFalse} alt="filter" width={tableIconSize} height={tableIconSize} /></td>
                                    <td style={{ alignContent: 'center', textAlign: 'center' }}><img src={game.game_info.discussed ? iconTrue : iconFalse} alt="filter" width={tableIconSize} height={tableIconSize} /></td>
                                    <td>{game.game_info.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={loadGames} className="btn btn-secondary">Refresh Data</button>
                </div>
            </div>
        </div>
    )
}