import {Column, Container, Row, RowColumn} from "@commonComponents/Container";
import {SettingsConfigurationPage} from "@components/SettingDataTable";
import {
    getAllDataSchedulerStatus,
    getAllGamesSchedulerStatus,
    triggerAllDataScheduler,
    triggerAllGamesScheduler
} from "@api/SteamAppsApi.ts";
import {useEffect, useState} from "react";
import Card from "@commonComponents/Card.tsx";
import {updateAllSteamAppRefData} from "@api/SteamAppRefDataApi.ts";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


export default function AdminPage() {
    const [allGamesJobStatus, setAllGamesJobStatus] = useState<boolean>(false);
    const [allDataJobStatus, setAllDataJobStatus] = useState<boolean>(false);

    const [updateRefDataStatusString, setUpdateRefDataStatusString] = useState<string | null>(null);


    const loadStatuses = async () => {
        await new Promise(f => setTimeout(f, 250));
        getAllGamesSchedulerStatus().then(setAllGamesJobStatus);
        getAllDataSchedulerStatus().then(setAllDataJobStatus);
    };


    useEffect(() => {
        loadStatuses().then();
    }, []);


    return (
        <Container>
            <Row style={{marginBottom: 15}}>
                <Column>
                    <Card title="Jobs">
                        <RowColumn>
                            <Button
                                label={`Update Reference Data ${updateRefDataStatusString ? ": " + updateRefDataStatusString : ""}`}
                                type={ButtonType.INFO} onClick={() => {
                                setUpdateRefDataStatusString("Updating...");
                                updateAllSteamAppRefData().then(() => setUpdateRefDataStatusString("Updated"));
                            }}/>
                        </RowColumn>
                        <Row>
                            <Column>
                                {jobRunningStatus("All Games", allGamesJobStatus)}
                            </Column>
                            <Column>
                                {jobRunningStatus("All Data", allDataJobStatus)}
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <Button label="Toggle Scheduler" type={ButtonType.PRIMARY}
                                        onClick={() => triggerAllGamesScheduler().then(setAllGamesJobStatus)}/>
                            </Column>
                            <Column>
                                <Button label="Toggle Scheduler" type={ButtonType.PRIMARY}
                                        onClick={() => triggerAllDataScheduler().then(setAllDataJobStatus)}/>
                            </Column>
                        </Row>
                    </Card>
                </Column>
                <Column>
                    <SettingsConfigurationPage/>
                </Column>
            </Row>
        </Container>
    );
}


function jobRunningStatus(jobName: string, isRunning: boolean) {
    const color = isRunning ? "green" : "red";

    return (
        <h5 style={{color: color}}>Job {jobName} is {!isRunning && "not"} running</h5>
    );
}