import type {SettingDto} from "@nct/vtp-common";
import {useEffect, useState} from "react";
import Card from "@commonComponents/Card";
import {deleteSettingByKey, readSettings} from "@/api/SettingApi";
import {Column, Row} from "@commonComponents/Container";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


export function SettingsConfigurationPage() {
    const [settingsData, setSettingsData] = useState<SettingDto[]>([]);
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


    // Runs once on page load
    useEffect(() => {
        loadSettingsData();
    }, []);


    //TODO: add possibility to update system settings from within UI
    return (
        <Card title='Settings'>
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
                                        {data.is_system ? "SYSTEM SETTING" :
                                            <Button label="X" type={ButtonType.DANGER}
                                                    onClick={() => deleteSettingByKey(data.key as string)}/>
                                        }
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