import {useEffect, useState} from "react";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import Card from "@commonComponents/Card.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import {getAllSteamAppRefData, updateAllSteamAppRefData} from "@api/SteamAppRefDataApi.ts";
import type {UserSteamAppRefDataConfigDto} from "@nct/vtp-common/dist/schemas/user_steam_app_ref_data_config.ts";
import {InputComponent, InputText} from "@commonComponents/InputComponent.tsx";
import {getGamesFilteredByRefData} from "@api/SteamAppsApi.ts";
import type {SteamAppDto} from "@nct/vtp-common";


export default function SteamAppTable() {
    const [appRefData, setAppRefData] = useState<UserSteamAppRefDataConfigDto[]>([]);
    const [loadingRefData, setLoadingRefData] = useState<boolean>(true);
    const [errorRefData, setErrorRefData] = useState<string | null>(null);

    const [filteredApps, setFilteredApps] = useState<SteamAppDto[]>([]);
    const [loadingSteamApps, setLoadingSteamApps] = useState<boolean>(false);
    const [errorSteamApps, setErrorSteamApps] = useState<string | null>(null);

    const [showGenres, setShowGenres] = useState<boolean>(true);
    const [showTags, setShowTags] = useState<boolean>(true);
    const [showCategories, setShowCategories] = useState<boolean>(true);
    const [showOnlyScored, setShowOnlyScored] = useState<boolean>(false);
    const [tagFilter, setTagFilter] = useState<string>("");


    const loadSteamAppRefData = async () => {
        setErrorRefData(null);
        setLoadingRefData(true);
        getAllSteamAppRefData()
            .then(setAppRefData)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setErrorRefData((e as Error).message);
            })
            .finally(() => setLoadingRefData(false));
    };


    const loadFilteredGames = async () => {
        setErrorSteamApps(null);
        setLoadingSteamApps(true);
        getGamesFilteredByRefData(appRefData)
            .then(setFilteredApps)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setErrorRefData((e as Error).message);
            })
            .finally(() => setLoadingSteamApps(false));
    };


    const onScoreChange = (value: number, id: string) => {
        const newRefData = appRefData.map(item => {
            if (item.id === id) {
                item.score = value;
            }
            return item;
        });
        setAppRefData(newRefData);
    };


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSteamAppRefData().then();
    }, []);


    return (
        <Card title="Steam Apps list">
            {/*TODO: add better UI separation*/}
            <Row>
                <Column>
                    <InputComponent
                        id="filterTags"
                        label="Filter"
                        placeholder=""
                        value={tagFilter}
                        onChange={(value: string) => {
                            setTagFilter(value)
                        }}
                    />
                    <button onClick={() => {
                        setShowCategories(!showCategories);
                    }} className="btn btn-success" style={{margin: 10}}>Categories: {showCategories ? "Yes" : "No"}
                    </button>
                    <button onClick={() => {
                        setShowTags(!showTags);
                    }} className="btn btn-success" style={{margin: 10}}>Tags: {showTags ? "Yes" : "No"}
                    </button>
                    <button onClick={() => {
                        setShowGenres(!showGenres);
                    }} className="btn btn-success" style={{margin: 10}}>Genres: {showGenres ? "Yes" : "No"}
                    </button>
                    <button onClick={() => {
                        setShowOnlyScored(!showOnlyScored);
                    }} className="btn btn-success" style={{margin: 10}}>Scored: {showOnlyScored ? "Yes" : "No"}
                    </button>
                </Column>
                <Column>
                    <br/>
                    <button onClick={loadSteamAppRefData} className="btn btn-warning" style={{margin: 10}}>Refresh
                        Data
                    </button>
                    <button onClick={() => {
                        setErrorRefData(null);
                        updateAllSteamAppRefData().then();
                    }} className="btn btn-info" style={{margin: 10}}>Update Reference Data
                    </button>
                    <button onClick={loadFilteredGames} className="btn btn-primary" style={{margin: 10}}>
                        Filter Games
                    </button>
                </Column>
            </Row>
            <Row>
                <Column>
                    <ItemLoadingErrorState label="steam apps" loading={loadingRefData} error={errorRefData}>
                        <div className="overflow-y-scroll" style={{height: 750}}>
                            <table className='table table-bordered'>
                                <thead>
                                <tr>
                                    <th scope="col" style={{width: '25%', textAlign: 'left'}}>Value</th>
                                    <th scope="col" style={{width: '25%'}}>Type</th>
                                    <th scope="col" style={{width: '25%'}}>UserValue</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appRefData.map((refData) => {
                                    if (tagFilter && !refData.value.includes(tagFilter))
                                        return;
                                    if (showOnlyScored && refData.score == 0)
                                        return;
                                    if (refData.type == 'TAG' && !showTags)
                                        return;
                                    if (refData.type == 'GENRE' && !showGenres)
                                        return;
                                    if (refData.type == 'CATEGORY' && !showCategories)
                                        return;

                                    return (
                                        <tr key={refData.id}>
                                            <td style={{textAlign: 'left'}}>{refData.value}</td>
                                            <td style={{textAlign: 'left'}}>{refData.type}</td>
                                            <InputText id={refData.id} value={refData.score.toString()}
                                                       onChange={onScoreChange}/>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </ItemLoadingErrorState>
                </Column>
                <Column>
                    <ItemLoadingErrorState label="steam apps" loading={loadingSteamApps} error={errorSteamApps}>
                        <div className="overflow-y-scroll" style={{height: 750}}>
                            <table className='table table-bordered'>
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredApps[0] == null && <h5>Try searching first :)</h5>}
                                {filteredApps.map((app) => {
                                    return (
                                        <tr key={app.id}>
                                            <td style={{textAlign: 'left', cursor: 'pointer'}}
                                                onClick={() => window.open(`https://store.steampowered.com/app/${app.id}/`, "_blank")}>{app.name}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </ItemLoadingErrorState>
                </Column>
            </Row>
        </Card>
    )
}