import {useEffect, useState} from "react";
import type {SteamAppDto} from "@nct/vtp-common";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState.tsx";
import Card from "@commonComponents/Card.tsx";
import {eventBus, EventName} from "@api/EventBus.ts";
import {getAllImportedApps} from "@api/SteamAppsApi.ts";


export default function SteamAppTable() {
    const [apps, setApps] = useState<SteamAppDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadApps = async () => {
        getAllImportedApps()
            .then(setApps)
            .catch(e => setError((e as Error).message))
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        loadApps();
    }, []);


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
                            <th scope="col" style={{width: '50%', textAlign: 'left'}}>App Name</th>
                            <th scope="col">Categories</th>
                            <th scope="col">Genres</th>
                            <th scope="col">User Tags</th>
                        </tr>
                        </thead>

                        <tbody>
                        {apps.map((app) => (
                            <tr key={app.id}>
                                <td>{app.id}</td>
                                <td>{app.name}</td>
                                <td>{arrayToString(app.categories)}</td>
                                <td>{arrayToString(app.genres)}</td>
                                <td>{arrayToString(app.tags)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </ItemLoadingErrorState>
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