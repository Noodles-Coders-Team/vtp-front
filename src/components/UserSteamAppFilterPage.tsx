import {useEffect, useState} from "react";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import type {UserSteamAppRefDataConfigDto} from "@nct/vtp-common/dist/schemas/user_steam_app_ref_data_config.ts";
import {InputComponent, InputNumber} from "@commonComponents/InputComponent.tsx";
import {getGamesFilteredByRefData} from "@api/SteamAppsApi.ts";
import type {SteamAppDto} from "@nct/vtp-common";
import {getAllUserScoreConfigRefData, saveUserScoreConfig} from "@api/UserGameScoreApi.ts";
import Button, {ButtonType} from "@commonComponents/Button.tsx";


interface UserSteamAppFilterProps {
    configId?: string | null
}


export default function UserSteamAppFilterPage({configId = null}: UserSteamAppFilterProps) {
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


    const setLoadingAndClearError = () => {
        setErrorRefData(null);
        setLoadingRefData(true);
    };


    const loadFiltersConfigRefData = async () => {
        getAllUserScoreConfigRefData(configId)
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

        if (configId != null) {
            saveUserScoreConfig(configId, newRefData).then();
        }
    };


    useEffect(() => {
        loadFiltersConfigRefData().then();
    }, []);


    return (
        <div>
            <Row style={{width: '50%'}}>
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
                    <Button label={`Categories: ${showCategories ? "Yes" : "No"}`} type={ButtonType.SUCCESS}
                            onClick={() => setShowCategories(!showCategories)}/>
                    <Button label={`Tags: ${showTags ? "Yes" : "No"}`} type={ButtonType.SUCCESS}
                            onClick={() => setShowTags(!showTags)}/>
                    <Button label={`Genres: ${showGenres ? "Yes" : "No"}`} type={ButtonType.SUCCESS}
                            onClick={() => setShowGenres(!showGenres)}/>
                    <Button label={`Scored: ${showOnlyScored ? "Yes" : "No"}`} type={ButtonType.SUCCESS}
                            onClick={() => setShowOnlyScored(!showOnlyScored)}/>

                    {configId == null &&
                        <Button label="Clear RefData" type={ButtonType.WARNING} onClick={() => {
                            setLoadingAndClearError();
                            loadFiltersConfigRefData().then();
                        }}/>
                    }
                    <Button label="Filter Games" type={ButtonType.PRIMARY} onClick={loadFilteredGames}/>
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
                                            <td>
                                                <InputNumber id={refData.id}
                                                             value={refData.score == undefined ? "0" : refData.score.toString()}
                                                             onChange={onScoreChange}/>
                                            </td>
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
                                {filteredApps[0] == null && <tr>
                                    <td><h5>Try searching first :)</h5></td>
                                </tr>}
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
        </div>
    )
}