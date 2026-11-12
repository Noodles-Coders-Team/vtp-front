import {Column, Container, Row, RowColumn} from "@commonComponents/Container";
import {SettingsConfigurationPage} from "@components/SettingDataTable";
import {
    getAllDataSchedulerStatus,
    getAllGamesSchedulerStatus,
    getAllTagsSchedulerStatus,
    triggerAllDataScheduler,
    triggerAllGamesScheduler,
    triggerAllTagsScheduler
} from "@api/SteamAppsApi.ts";
import {useEffect, useState} from "react";
import Card from "@commonComponents/Card.tsx";
import {updateAllSteamAppRefData} from "@api/SteamAppRefDataApi.ts";


export default function AdminPage() {
    const [allGamesJobStatus, setAllGamesJobStatus] = useState<boolean>(false);
    const [allDataJobStatus, setAllDataJobStatus] = useState<boolean>(false);
    const [allTagsJobStatus, setAllTagsJobStatus] = useState<boolean>(false);

    const [updateRefDataStatusString, setUpdateRefDataStatusString] = useState<string | null>(null);


    const loadStatuses = async () => {
        await new Promise(f => setTimeout(f, 250));
        getAllGamesSchedulerStatus().then(setAllGamesJobStatus);
        getAllDataSchedulerStatus().then(setAllDataJobStatus);
        getAllTagsSchedulerStatus().then(setAllTagsJobStatus);
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
                            <button onClick={() => {
                                setUpdateRefDataStatusString("Updating...");
                                updateAllSteamAppRefData().then(() => setUpdateRefDataStatusString("Updated"));
                            }} className="btn btn-info" style={{margin: 10}}>Update Reference
                                Data {updateRefDataStatusString && ": " + updateRefDataStatusString}
                            </button>
                        </RowColumn>
                        <Row>
                            <Column>
                                {jobRunningStatus("All Games", allGamesJobStatus)}
                            </Column>
                            <Column>
                                {jobRunningStatus("All Data", allDataJobStatus)}
                            </Column>
                            <Column>
                                {jobRunningStatus("All Tags", allTagsJobStatus)}
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <button className="btn btn-primary" onClick={() => {
                                    triggerAllGamesScheduler().then(setAllGamesJobStatus);
                                }}>
                                    Toggle Scheduler
                                </button>
                            </Column>
                            <Column>
                                <button className="btn btn-primary" onClick={() => {
                                    triggerAllDataScheduler().then(setAllDataJobStatus);
                                }}>
                                    Toggle Scheduler
                                </button>
                            </Column>
                            <Column>
                                <button className="btn btn-primary" onClick={() => {
                                    triggerAllTagsScheduler().then(setAllTagsJobStatus);
                                }}>
                                    Toggle Scheduler
                                </button>
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