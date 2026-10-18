import {useEffect, useState} from "react";
import type {SteamAppDto} from "@nct/vtp-common";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import Card from "@commonComponents/Card.tsx";
import {eventBus, EventName} from "@api/EventBus.ts";
import {getAllImportedApps} from "@api/SteamAppsApi.ts";
import {Column, Row} from "@commonComponents/Container.tsx";


export default function SteamAppTable() {
    const [apps, setApps] = useState<SteamAppDto[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const loadApps = async () => {
        getAllImportedApps(page)
            .then(setApps)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setError((e as Error).message);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        loadApps();
    }, [page]);


    useEffect(() => {
        eventBus.addEventListener(EventName.SteamAppsUpdated, loadApps);
        return () => {
            eventBus.removeEventListener(EventName.SteamAppsUpdated, loadApps);
        };
    }, []);


    return (
        <Card title="Steam Apps list">
            <button onClick={() => {
                setError(null);
                loadApps();
            }} className="btn btn-secondary" style={{margin: 10}}>Refresh Data
            </button>
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
            <Row style={{marginTop: 10}}>
                <Column>
                    <button onClick={() => {
                        setError(null);
                        if (page > 1) setPage(page - 1);
                    }} className="btn btn-secondary">Previous Page
                    </button>
                </Column>
                <Column>
                    <h5 style={{alignContent: "center"}}>{page}</h5>
                </Column>
                <Column>
                    <button onClick={() => {
                        setError(null);
                        setPage(page + 1);
                    }} className="btn btn-secondary">Next Page
                    </button>
                </Column>
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