import { eventBus } from "@/api/EventBus";
import { readGamesWithInfo, updateGameInfo } from "@/api/GamesApi";
import type { GameWithInfoDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";
import { TableColumnNameBooleanFilter } from "../commonComponents/TableColumnNameBooleanFilter";
import iconTrue from '@assets/check_box_64.svg';
import iconFalse from '@assets/check_box_empty_64.svg';
import Card from "../commonComponents/Card";

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

    const onToggleCanRecord = async (id: string) => {
        let game = games.find((g) => g.id == id);
        if (game === undefined) {
            console.error(`Game not found with id: ${id}`);
            return;
        }
        game.game_info.can_record = !game?.game_info.can_record;
        updateGameInfo(game.game_info);
        await loadGames();
    }

    const onToggleDiscussed = async (id: string) => {
        let game = games.find((g) => g.id == id);
        if (game === undefined) {
            console.error(`Game not found with id: ${id}`);
            return;
        }
        game.game_info.discussed = !game?.game_info.discussed;
        updateGameInfo(game.game_info);
        await loadGames();
    }

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

    return (
        <Card title="Games list">
            <button onClick={loadGames} className="btn btn-secondary">Refresh Data</button>
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
                                <TableTogglebox value={game.game_info.can_record} id={game.id} onToggle={onToggleCanRecord} size={tableIconSize} />
                                <TableTogglebox value={game.game_info.discussed} id={game.id} onToggle={onToggleDiscussed} size={tableIconSize} />
                                <td>{game.game_info.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}


type TableToggleboxProps = {
    value: boolean;
    id: string;
    onToggle: (id: string) => void;
    size: number;
}


function TableTogglebox({ value, id, onToggle, size = 32 }: TableToggleboxProps) {
    const [currentValue, setCurrentValue] = useState<boolean>(value);
    return (
        <td
            onClick={(e) => { e.preventDefault(); onToggle(id); setCurrentValue(!currentValue); }}
            style={{ alignContent: 'center', textAlign: 'center', cursor: 'pointer' }}>
            <img src={currentValue ? iconTrue : iconFalse} alt="filter" width={size} height={size} />
        </td>
    )

}