import { deleteDropDownData } from "@/api/DropDownDataApi";
import { eventBus } from "@/api/EventBus";
import type { SettingDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";
import Card from "./commonComponents/Card";
import { readSettings } from "@/api/SettingApi";

export function SettingsConfigurationPage() {
    const [settingsData, setSettingsData] = useState<SettingDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadSettingsData = async () => {
        try {
            setLoading(true);
            const data = await readSettings();
            setSettingsData(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };


    // Runs once on page load
    useEffect(() => {
        loadSettingsData();
    }, []);


    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener('SettingsTableShouldBeRefreshed', loadSettingsData);
        return () => {
            eventBus.removeEventListener('SettingsTableShouldBeRefreshed', loadSettingsData);
        };
    }, []);

    if (loading) return <p>Loading Settings Data...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading Settings data: {error}</p>;

    const deleteData = async (key: string) => {
        deleteDropDownData(key);
    };


    return (
        <Card title='Settings List'>
            <div className="overflow-y-scroll" style={{ height: 400 }}>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">Display</th>
                            <th scope="col">Value</th>
                            <th scope="col">Key</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {settingsData.map((data) => (
                            <tr key={data.key}>
                                <td>{data.display}</td>
                                <td>{data.value}</td>
                                <td>{data.key}</td>
                                <td><button className="btn btn-danger" onClick={() => deleteData(data.key as string)}>X</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={loadSettingsData} className="btn btn-secondary">Refresh Data</button>
        </Card>
    );
}