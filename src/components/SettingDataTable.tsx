import {eventBus} from "@/api/EventBus";
import type {SettingDto} from "@nct/vtp-common";
import {useEffect, useState} from "react";
import Card from "./commonComponents/Card";
import {createSetting, deleteSettingByKey, readSettings} from "@/api/SettingApi";
import {Column, Row} from "./commonComponents/Container";
import {InputComponent} from "./commonComponents/InputComponent";
import {ItemLoadingErrorState} from "@/components/commonComponents/ItemLoadingErrorState.tsx";

export function SettingsConfigurationPage() {
    const [settingsData, setSettingsData] = useState<SettingDto[]>([]);
    const [settingCreate, setSettingCreate] = useState<SettingDto>({} as SettingDto);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadSettingsData = () => {
        readSettings()
            .then(data => setSettingsData(data))
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();

        await createSetting(settingCreate);

        // Clear form after submission
        setSettingCreate({} as SettingDto);
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


    return (
        <Card title='Settings'>
            <div>
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Column>
                            <InputComponent
                                id="settingDisplay"
                                label="Setting Name"
                                placeholder="Setting Name"
                                value={settingCreate.display}
                                onChange={(value: string) => setSettingCreate({...settingCreate, display: value})}
                            />
                        </Column>
                        <Column>
                            <InputComponent
                                id="settingValue"
                                label="Value"
                                placeholder="100"
                                value={settingCreate.value}
                                onChange={(value: string) => setSettingCreate({...settingCreate, value: value})}
                            />
                        </Column>
                        <Column>
                            <InputComponent
                                id="settingKey"
                                label="Key"
                                placeholder="setting_name"
                                value={settingCreate.key}
                                onChange={(value: string) => setSettingCreate({...settingCreate, key: value})}/>
                        </Column>
                        <Column>
                            <button type="submit" className="btn btn-success" style={{marginTop: 15}}>Create</button>
                        </Column>
                    </Row>
                </form>
            </div>
            <br/>
            <ItemLoadingErrorState label={"settings"} loading={loading} error={error}>
                <div className="overflow-y-scroll" style={{height: 400}}>
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
                                <td>
                                    <button className="btn btn-danger"
                                            onClick={() => deleteSettingByKey(data.key as string)}>X
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <br/>
            </ItemLoadingErrorState>
            <button onClick={() => {
                setError(null);
                loadSettingsData();
            }} className="btn btn-secondary">Refresh Data
            </button>
        </Card>
    );
}