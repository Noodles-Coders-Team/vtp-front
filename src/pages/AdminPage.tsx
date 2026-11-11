import {Column, Container, Row} from "@commonComponents/Container";
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


export default function AdminPage() {
    const [allGamesJobStatus, setAllGamesJobStatus] = useState<boolean>(false);
    const [allDataJobStatus, setAllDataJobStatus] = useState<boolean>(false);
    const [allTagsJobStatus, setAllTagsJobStatus] = useState<boolean>(false);


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
            <Row>
                <Card title="Jobs">
                    <Row>
                        <Column>
                            <button className="btn btn-primary" onClick={() => {
                                triggerAllGamesScheduler().then(setAllGamesJobStatus);
                            }}>
                                Trigger Scheduler: All Games
                            </button>
                        </Column>
                        <Column>
                            <button className="btn btn-primary" onClick={() => {
                                triggerAllDataScheduler().then(setAllDataJobStatus);
                            }}>
                                Trigger Scheduler: All Data
                            </button>
                        </Column>
                        <Column>
                            <button className="btn btn-primary" onClick={() => {
                                triggerAllTagsScheduler().then(setAllTagsJobStatus);
                            }}>
                                Trigger Scheduler: All Tags
                            </button>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            {allGamesJobStatus ? jobIsRunning() : jobIsNotRunning()}
                        </Column>
                        <Column>
                            {allDataJobStatus ? jobIsRunning() : jobIsNotRunning()}
                        </Column>
                        <Column>
                            {allTagsJobStatus ? jobIsRunning() : jobIsNotRunning()}
                        </Column>
                    </Row>
                </Card>
            </Row>
            <Row>
                <Column>
                    <SettingsConfigurationPage/>
                </Column>
            </Row>
        </Container>
    );
}


function jobIsRunning() {
    return (
        <h5 style={{color: "green"}}>Job is running</h5>
    );
}


function jobIsNotRunning() {
    return (
        <h5 style={{color: "red"}}>Job is not running</h5>
    );
}