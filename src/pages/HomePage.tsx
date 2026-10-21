import Card from "@commonComponents/Card";
import {Column, Container, Row} from "@commonComponents/Container";
import {
    getAllDataSchedulerStatus,
    getAllGamesSchedulerStatus,
    getAllTagsSchedulerStatus,
    triggerAllDataScheduler,
    triggerAllGamesScheduler,
    triggerAllTagsScheduler
} from "@api/SteamAppsApi.ts";
import {useEffect, useState} from "react";


export default function HomePage() {

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
        loadStatuses();
    }, []);


    return (
        <Container>
            <Card title='Welcome to the Video Tracking & Planning app'>
                <Row>
                    <Column>
                        <p>This is the home page of the App.</p>
                    </Column>
                </Row>
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