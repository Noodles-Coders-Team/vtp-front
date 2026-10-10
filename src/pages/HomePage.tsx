import Card from "@commonComponents/Card";
import {Column, Container, Row} from "@commonComponents/Container";
import {triggerAllDataScheduler, triggerAllGamesScheduler} from "@api/SteamAppsApi.ts";


export default function HomePage() {

    return (
        <Container style={{width: '50%'}}>
            <Card title='Welcome to the Video Tracking & Planning app'>
                <Container>
                    <Row>
                        <Column>
                            <p>This is the home page of the App.</p>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <button className="btn btn-primary" onClick={() => triggerAllGamesScheduler()}>
                                Trigger Scheduler: All Games
                            </button>
                        </Column>
                        <Column>
                            <button className="btn btn-primary" onClick={() => triggerAllDataScheduler()}>
                                Trigger Scheduler: All Data
                            </button>
                        </Column>
                    </Row>
                </Container>
            </Card>
        </Container>
    );
}