import {useEffect, useState} from "react";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import type {SteamAppDto, UserGameScoreConfigDto, UserSteamAppRefDataConfigDto} from "@nct/vtp-common";
import {InputComponent, InputNumber} from "@commonComponents/InputComponent.tsx";
import {getGamesFilteredByConfigId, getGamesFilteredByRefData} from "@api/SteamAppsApi.ts";
import {getAllUserScoreConfigRefData, saveUserMinMaxConfig, saveUserScoreConfig} from "@api/UserGameScoreApi.ts";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


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


    const [minimumReviewsInput, setMinimumReviewsInput] = useState<number | null>(null);
    const [minimumRatingInput, setMinimumRatingInput] = useState<number | null>(null);


    const setLoadingAndClearError = () => {
        setErrorRefData(null);
        setLoadingRefData(true);
    };


    const loadFiltersConfigRefData = async () => {
        getAllUserScoreConfigRefData(configId)
            .then(setUserConfigParameters)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setErrorRefData((e as Error).message);
            })
            .finally(() => setLoadingRefData(false));
    };


    const setUserConfigParameters = (data: UserGameScoreConfigDto) => {
        setAppRefData(data.score_config);
        setMinimumRatingInput(data.positive_reviews_percentage ?? null);
        setMinimumReviewsInput(data.minimum_reviews ?? null);
    }


    const loadFilteredGames = async () => {
        setErrorSteamApps(null);
        setLoadingSteamApps(true);
        (configId == null ? getGamesFilteredByRefData(appRefData) : getGamesFilteredByConfigId(configId))
            .then(setFilteredApps)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setErrorSteamApps((e as Error).message);
            })
            .finally(() => setLoadingSteamApps(false));
    };


    const onScoreChange = (value: number, id: string) => {
        setAppRefData(prev => prev.map(item => item.id == id ? {...item, score: value} : item));

        if (configId != null) {
            saveUserScoreConfig(configId, appRefData).then();
        }
    };


    const updateMinimumsInConfig = () => {
        if (configId != null) {
            saveUserMinMaxConfig(configId, minimumReviewsInput, minimumRatingInput).then();
        }
    }


    useEffect(() => {
        loadFiltersConfigRefData().then();
    }, [configId]);


    return (
        <div>
            <Row style={{width: '50%'}}>
                <Column>
                    <InputComponent
                        id="filterTags"
                        label="Search"
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
                    {configId == null &&
                        <Button label="Clear Config" type={ButtonType.WARNING} onClick={() => {
                            setLoadingAndClearError();
                            loadFiltersConfigRefData().then();
                        }}
                                tooltip="Resets configuration"/>
                    }
                    <br/>
                    <Button label={`Scored: ${showOnlyScored ? "Yes" : "No"}`} type={ButtonType.INFO}
                            tooltip="Shows only scored Values"
                            onClick={() => setShowOnlyScored(!showOnlyScored)}/>
                    <Button label="Search Games" type={ButtonType.PRIMARY} onClick={loadFilteredGames}/>
                    {configId != null && <>
                        <br/>
                        <Row>
                            <Column>
                                <p>Minimum Reviews</p>
                                <InputNumber id="minimumReviewsInput"
                                             value={minimumReviewsInput?.toString() ?? "0"}
                                             onChange={(n) => {
                                                 setMinimumReviewsInput(n);
                                                 updateMinimumsInConfig();
                                             }}/>
                            </Column>
                            <Column>
                                <p>Minimum Rating</p>
                                <InputNumber id="minimumRatingInput"
                                             value={minimumRatingInput?.toString() ?? "0"}
                                             onChange={(n) => {
                                                 setMinimumRatingInput(n);
                                                 updateMinimumsInConfig();
                                             }}/>
                            </Column>
                        </Row>
                    </>}
                    <br/>
                </Column>
            </Row>
            <Row>
                <Column>
                    <ItemLoadingErrorState label="steam apps" loading={loadingRefData} error={errorRefData}>
                        <div className="overflow-y-scroll" style={{height: 750}}>
                            <table className='table table-bordered'>
                                <thead>
                                <tr>
                                    <th scope="col" style={{width: '25%', textAlign: 'left'}}>Name</th>
                                    <th scope="col" style={{width: '25%'}}>Type</th>
                                    <th scope="col" style={{width: '25%'}}>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appRefData.filter(refData => {
                                    if (tagFilter && !refData.value.toUpperCase().includes(tagFilter.toUpperCase()))
                                        return false;
                                    if (showOnlyScored && refData.score == 0)
                                        return false;
                                    if (refData.type == 'TAG' && !showTags)
                                        return false;
                                    if (refData.type == 'GENRE' && !showGenres)
                                        return false;
                                    if (refData.type == 'CATEGORY' && !showCategories)
                                        return false;
                                    return true;
                                }).map((refData) => {
                                    return (
                                        <tr key={refData.id}>
                                            <td style={{textAlign: 'left'}}>{refData.value}</td>
                                            <td style={{textAlign: 'center'}}>{refData.type}</td>
                                            <td>
                                                <ScoreSelector id={refData.id}
                                                               value={refData.score == undefined ? 0 : refData.score}
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


interface ScoreSelectorProps {
    id: string
    value: number
    onChange: (value: number, id: string) => void
}


function ScoreSelector({id, value, onChange}: ScoreSelectorProps) {
    return (
        <>
            <Button subtle={value != -10} label="-10" tooltip="I don't want to see it" type={ButtonType.DANGER}
                    onClick={() => onChange(-10, id)}/>
            <Button subtle={value != -5} label="-5" tooltip="I fine with seeing it" type={ButtonType.WARNING}
                    onClick={() => onChange(-5, id)}/>
            <Button subtle={value != 0} label="0" tooltip="I don't care" type={ButtonType.PRIMARY}
                    onClick={() => onChange(0, id)}/>
            <Button subtle={value != 5} label="5" tooltip="I prefer to see it" type={ButtonType.ACCENT}
                    onClick={() => onChange(5, id)}/>
            <Button subtle={value != 10} label="10" tooltip="I want to see it" type={ButtonType.SUCCESS}
                    onClick={() => onChange(10, id)}/>
        </>
    )
}