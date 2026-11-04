import {useEffect, useState} from "react";
import type {SteamAppDto} from "@nct/vtp-common";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import Card from "@commonComponents/Card.tsx";
import {eventBus, EventName} from "@api/EventBus.ts";
import {getFilteredByTagsApps} from "@api/SteamAppsApi.ts";
import {Column, Row} from "@commonComponents/Container.tsx";
import {InputComponent} from "@commonComponents/InputComponent.tsx";


export default function SteamAppSearcher() {
    const [apps, setApps] = useState<SteamAppDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<string[]>(["", ""]);


    const loadApps = async () => {
        getFilteredByTagsApps(filters[0], filters[1])
            .then(setApps)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setError((e as Error).message);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        eventBus.addEventListener(EventName.SteamAppsUpdated, loadApps);
        return () => {
            eventBus.removeEventListener(EventName.SteamAppsUpdated, loadApps);
        };
    });


    return (
        <Card title="Steam Apps list">
            <Row>
                <Column>
                    <button onClick={() => {
                        setError(null);
                        loadApps().then();
                    }} className="btn btn-secondary" style={{margin: 10}}>Refresh Data
                    </button>
                </Column>
            </Row>
            <Row style={{marginBottom: 20}}>
                <Column>
                    <InputComponent
                        id="tags"
                        label="Tags"
                        placeholder="'Tennis', 'Vehicular Combat'"
                        value={filters[0]}
                        onChange={(value: string) => setFilters([value, filters[1]])}
                    />
                </Column>
                <Column>
                    <InputComponent
                        id="tag_weights"
                        label="weights"
                        placeholder="-20, 20"
                        value={filters[1]}
                        onChange={(value: string) => setFilters([filters[0], value])}
                    />
                </Column>
            </Row>
            <Row>
                <ItemLoadingErrorState label="steam apps" loading={loading} error={error}>
                    <div className="overflow-y-scroll" style={{height: 750}}>
                        <table className='table table-bordered'>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" style={{width: '25%', textAlign: 'left'}}>App Name</th>
                                <th scope="col" style={{width: '25%'}}>Categories</th>
                                <th scope="col" style={{width: '25%'}}>Genres</th>
                                <th scope="col" style={{width: '25%'}}>User Tags</th>
                            </tr>
                            </thead>

                            <tbody>
                            {apps.map((app) => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td style={{textAlign: 'left'}}>{app.name}</td>
                                    <td>{arrayToString(app.categories)}</td>
                                    <td>{arrayToString(app.genres)}</td>
                                    <td>{arrayToString(app.tags)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </ItemLoadingErrorState>
            </Row>
        </Card>
    )
}


function arrayToString(arr: string[] | undefined): string {
    let res = "";
    if (arr === undefined)
        return res;
    arr.forEach((item) => {
        if (res == "")
            res += item;
        else
            res += ", " + item;
    });
    return res;
}