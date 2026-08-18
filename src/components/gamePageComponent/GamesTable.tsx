import { eventBus } from "@/api/EventBus";
import { readGamesWithInfo, updateGameInfo } from "@/api/GamesApi";
import type { DropDownDto, GameWithInfoDto } from "@nct/vtp-common";
import { useEffect, useState, type ReactNode } from "react";
import { TableColumnNameBooleanFilter } from "../commonComponents/TableColumnNameBooleanFilter";
import iconTrue from '@assets/check_box_64.svg';
import iconFalse from '@assets/check_box_empty_64.svg';
import iconDesc from '@assets/arrow_upward_64.svg';
import iconAsc from '@assets/arrow_downward_64.svg';
import iconFilterOff from '@assets/filter_off_64.svg';
import Card from "../commonComponents/Card";
import { getGenreDropDownData, getTagDropDownData } from "@/api/DropDownDataApi";

const tableIconSize = 32;

export default function GamesTable() {
    const [games, setGames] = useState<GameWithInfoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //Custom filters
    const [can_record, setCanRecord] = useState<boolean | null>(null);
    const [discussed, setDiscussed] = useState<boolean | null>(null);

    const [tagDropDownData, setTagDropDownData] = useState<DropDownDto[]>([]);
    const [genreDropDownData, setGenreDropDownData] = useState<DropDownDto[]>([]);

    const loadDropDownData = async () => {
        try {
            setLoading(true);

            const tags = await getTagDropDownData();
            setTagDropDownData(tags);

            const genres = await getGenreDropDownData();
            setGenreDropDownData(genres);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

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
        game.can_record = !game?.can_record;
        updateGameInfo(game);
        await loadGames();
    }

    const onToggleDiscussed = async (id: string) => {
        let game = games.find((g) => g.id == id);
        if (game === undefined) {
            console.error(`Game not found with id: ${id}`);
            return;
        }
        game.discussed = !game?.discussed;
        updateGameInfo(game);
        await loadGames();
    }


    const onToggleTextColumnSorting = (id: string, state: number) => {
        // 0 - NA; 1 - ASC; -1 - DESC;
        if (state == 0)
            return;

        if (id == 'name') {
            setGames([...games].sort((a, b) => {
                const nA = a.name.toUpperCase();
                const nB = b.name.toUpperCase();

                if (nA < nB) {
                    return -1 * state;
                }
                else if (nA > nB) {
                    return 1 * state;
                }
                else {
                    return 0;
                }
            }));
        }

        if (id == 'score') {
            setGames([...games].sort((a, b) => {
                const nA = a.game_score ?? 0;
                const nB = b.game_score ?? 0;
                return (nA - nB) * state;
            }));
        }
    };


    useEffect(() => {
        loadDropDownData();
    }, []);

    useEffect(() => {
        loadGames();
    }, [genreDropDownData, can_record, discussed]);

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
            <div className="overflow-y-scroll" style={{ height: 750 }}>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <TableTextColumnName id={"name"} onChangeState={onToggleTextColumnSorting} style={{ width: '50%', textAlign: 'left' }}>Game Name</TableTextColumnName>
                            {/* <th scope="col" style={{ width: '50%', textAlign: 'left' }}>Game Name</th> */}
                            <TableColumnNameBooleanFilter label="Can Record" value={can_record} onChange={setCanRecord} />
                            <TableColumnNameBooleanFilter label="Discussed" value={discussed} onChange={setDiscussed} />
                            <TableTextColumnName id={"score"} onChangeState={onToggleTextColumnSorting}>Score</TableTextColumnName>
                            {/* <th scope="col">Score</th> */}
                            <th scope="col">Genre</th>
                            <th scope="col">Tags</th>
                            <th scope="col">Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id}>
                                <td>{games.indexOf(game) + 1}</td>
                                <td>{game.name}</td>
                                <TableTogglebox value={game.can_record} id={game.id} onToggle={onToggleCanRecord} />
                                <TableTogglebox value={game.discussed} id={game.id} onToggle={onToggleDiscussed} />
                                <td>{game.game_score ?? 0}</td>
                                <DropDownValue value={game.genre} mappings={genreDropDownData} />
                                <DropDownValue value={game.tags} mappings={tagDropDownData} />
                                <td>{game.notes}</td>
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
    size?: number;
}

type TableColumnNameProps = {
    children: ReactNode;
    state?: number;
    id: string;
    onChangeState: (id: string, newState: number) => void;
    size?: number;
    style?: React.CSSProperties | undefined;
}

type DropDownValueProps = {
    value: string[] | undefined;
    mappings: DropDownDto[];
}

interface IColorDictionary {
    [key: number]: string;
}

const Color_To_Score_Mapping: IColorDictionary = {
    0: "orange",
    1: "green",
    "-1": "red"
}

function DropDownValue({ value, mappings }: DropDownValueProps) {

    const getColor = (value: string) => {
        const default_color = "pink";
        if (value == "")
            return default_color;
        const data: DropDownDto = mappings.find((data) => data.value == value) as DropDownDto;
        if (data === null || data === undefined)
            return default_color;
        return Color_To_Score_Mapping[data?.score] ?? default_color;
    };

    return (
        <td>
            {value?.map((v => (
                <div style={{ backgroundColor: getColor(v), borderRadius: 5, marginTop: 2 }}>{v}</div>
            )))}
        </td>
    )
}


function TableTogglebox({ value, id, onToggle, size = tableIconSize }: TableToggleboxProps) {
    const [currentValue, setCurrentValue] = useState<boolean>(value);
    return (
        <td
            onClick={(e) => { e.preventDefault(); onToggle(id); setCurrentValue(!currentValue); }}
            style={{ alignContent: 'center', textAlign: 'center', cursor: 'pointer' }}
        >
            <img src={currentValue ? iconTrue : iconFalse} alt="filter" width={size} height={size} />
        </td>
    )

}


function TableTextColumnName({ state = 0, id, children, onChangeState, size = tableIconSize, style }: TableColumnNameProps) {
    const [currentState, setCurrentState] = useState<number>(state);


    const resetSorting = () => {
        setCurrentState(0);
    };


    useEffect(() => {
        resetSorting();
        console.log(`Default for ${id} is ${currentState}`);
        eventBus.addEventListener('SortingShouldBeReset', resetSorting);
        return () => {
            eventBus.removeEventListener('SortingShouldBeReset', resetSorting);
        };
    }, []);



    const toggleState = () => {
        let state: number = 0;
        if (currentState == 0)
            state = 1;
        else if (currentState == 1)
            state = -1;
        else if (currentState == -1)
            state = 0;
        eventBus.dispatchEvent(new Event('SortingShouldBeReset'));
        setCurrentState(state);
        onChangeState(id, state);
    };

    return (
        <td
            onClick={async (e) => { e.preventDefault(); toggleState(); }}
            style={style && { alignContent: 'center', textAlign: 'center', cursor: 'pointer' }}
        >
            {currentState == 0 &&
                <img src={iconFilterOff} alt="Sortign Off" width={size} height={size} />
            }
            {currentState == 1 &&
                <img src={iconAsc} alt="ASC" width={size} height={size} />
            }
            {currentState == -1 &&
                <img src={iconDesc} alt="DESC" width={size} height={size} />
            }
            <p>{children}</p>
        </td>
    )
}