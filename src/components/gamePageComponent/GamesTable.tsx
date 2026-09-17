import {eventBus} from "@/api/EventBus";
import {readGamesWithInfo, updateGameInfo} from "@/api/GamesApi";
import type {DropDownDto, GameWithInfoDto} from "@nct/vtp-common";
import {useEffect, useState} from "react";
import {TableColumnNameBooleanFilter} from "../commonComponents/TableColumnNameBooleanFilter";
import Card from "../commonComponents/Card";
import {getGenreDropDownData, getTagDropDownData} from "@/api/DropDownDataApi";
import {ItemLoadingErrorState} from "@/components/commonComponents/ItemLoadingErrorState.tsx";
import {TableTextColumnName} from "@/components/commonComponents/TableTextColumnName.tsx";
import {TableToggleable} from "@/components/commonComponents/TableToggleable.tsx";

export default function GamesTable() {
    const [games, setGames] = useState<GameWithInfoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //Custom filters
    const [can_record, setCanRecord] = useState<boolean | null>(null);
    const [discussed, setDiscussed] = useState<boolean | null>(null);

    const [tagDropDownData, setTagDropDownData] = useState<DropDownDto[]>([]);
    const [genreDropDownData, setGenreDropDownData] = useState<DropDownDto[]>([]);

    const loadDropDownData = () => {
        getTagDropDownData()
            .then(data => setTagDropDownData(data))
            .catch((e) => {
                if (error === null) setError((e as Error).message);
                else setError(error.concat((e as Error).message));
            });

        getGenreDropDownData().then(data => setGenreDropDownData(data))
            .catch((e) => {
                if (error === null) setError((e as Error).message);
                else setError(error.concat((e as Error).message));
            });
    };

    const loadGames = () => {
        readGamesWithInfo(can_record, discussed)
            .then(setGames)
            .catch(e => setError((e as Error).message))
            .finally(() => setLoading(false));
    };

    const onToggleCanRecord = async (id: string) => {
        const game = games.find((g) => g.id == id);
        if (game === undefined) {
            console.error(`Game not found with id: ${id}`);
            return;
        }
        game.can_record = !game?.can_record;
        updateGameInfo(game).then(() => loadGames());
    }

    const onToggleDiscussed = async (id: string) => {
        const game = games.find((g) => g.id == id);
        if (game === undefined) {
            console.error(`Game not found with id: ${id}`);
            return;
        }
        game.discussed = !game?.discussed;
        updateGameInfo(game).then(() => loadGames());
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
                } else if (nA > nB) {
                    return state;
                } else {
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
    }, [can_record, discussed]);

    useEffect(() => {
        eventBus.addEventListener('GameTableShouldBeRefreshed', loadGames);
        return () => {
            eventBus.removeEventListener('GameTableShouldBeRefreshed', loadGames);
        };
    }, []);

    return (
        <Card title="Games list">
            <button onClick={() => {
                setError(null);
                loadGames();
            }} className="btn btn-secondary">Refresh Data
            </button>
            <ItemLoadingErrorState label="games" loading={loading} error={error}>
                <div className="overflow-y-scroll" style={{height: 750}}>
                    <table className='table table-bordered'>
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <TableTextColumnName id={"name"} onChangeState={onToggleTextColumnSorting}
                                                 style={{width: '50%', textAlign: 'left'}}>Game
                                Name</TableTextColumnName>
                            {/* <th scope="col" style={{ width: '50%', textAlign: 'left' }}>Game Name</th> */}
                            <TableColumnNameBooleanFilter label="Can Record" value={can_record}
                                                          onChange={setCanRecord}/>
                            <TableColumnNameBooleanFilter label="Discussed" value={discussed} onChange={setDiscussed}/>
                            <TableTextColumnName id={"score"}
                                                 onChangeState={onToggleTextColumnSorting}>Score</TableTextColumnName>
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
                                <TableToggleable value={game.can_record} id={game.id} onToggle={onToggleCanRecord}/>
                                <TableToggleable value={game.discussed} id={game.id} onToggle={onToggleDiscussed}/>
                                <td>{game.game_score ?? 0}</td>
                                <DropDownValue value={game.genre} mappings={genreDropDownData}/>
                                <DropDownValue value={game.tags} mappings={tagDropDownData}/>
                                <td>{game.notes}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </ItemLoadingErrorState>
        </Card>
    )
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

function DropDownValue({value, mappings}: DropDownValueProps) {

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
                <div style={{backgroundColor: getColor(v), borderRadius: 5, marginTop: 2}}>{v}</div>
            )))}
        </td>
    )
}


