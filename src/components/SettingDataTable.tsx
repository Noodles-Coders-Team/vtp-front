import {eventBus, EventName} from "@api/EventBus";
import type {SettingDto} from "@nct/vtp-common";
import {useEffect, useState} from "react";
import Card from "@commonComponents/Card";
import {createSetting, deleteSettingByKey, readSettings} from "@/api/SettingApi";
import {Column, Row} from "@commonComponents/Container";
import {InputComponent} from "@commonComponents/InputComponent";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


export function SettingsConfigurationPage() {
    const [settingsData, setSettingsData] = useState<SettingDto[]>([]);
    const [settingCreate, setSettingCreate] = useState<SettingDto>({} as SettingDto);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadSettingsData = () => {
        readSettings()
            .then(setSettingsData)
            .catch(e => {
                if ((e as Error).name !== "AbortError")
                    setError((e as Error).message);
            })
            .finally(() => setLoading(false));
    };


    const handleCreateSettingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();
        createSettingSubmit().then();
    };


    const createSettingSubmit = async () => {
        setSettingCreate({...settingCreate, is_system: false});
        await createSetting(settingCreate);

        // Clear form after submission
        setSettingCreate({} as SettingDto);
    }


    // Runs once on page load
    useEffect(() => {
        loadSettingsData();
    }, []);


    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener(EventName.SettingsUpdated, loadSettingsData);
        return () => {
            eventBus.removeEventListener(EventName.SettingsUpdated, loadSettingsData);
        };
    }, []);


    return (
        <Card title='Settings'>
            <form onSubmit={handleCreateSettingSubmit}>
                <Row>
                    <Column>
                        <InputComponent
                            id="settingDisplay"
                            label="Name"
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
                        <Button label="Create" style={{marginTop: 30}} type={ButtonType.SUCCESS}
                                onClick={() => createSettingSubmit().then()}/>
                    </Column>
                </Row>
            </form>
            <br/>
            <Row>
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
                                        <Button label="X" type={ButtonType.DANGER}
                                                onClick={() => deleteSettingByKey(data.key as string)}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <br/>
                </ItemLoadingErrorState>
            </Row>
            <Row style={{marginTop: 15}}>
                <Column>
                    <Button label="Refresh Data" type={ButtonType.SECONDARY}
                            onClick={() => {
                                setError(null);
                                loadSettingsData();
                            }}
                    />
                </Column>
            </Row>
        </Card>
    );
}