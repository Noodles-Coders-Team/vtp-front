import Card from "@/components/commonComponents/Card";
import {Column, Container, Row} from "@/components/commonComponents/Container";
import {useEffect} from "react";

export default function HomePage() {
    useEffect(() => {
        document.title = "Video Tracker & Planner";
    });

    return (
        <Container style={{width: '50%'}}>
            <Card title='Welcome to the Video Tracking & Planning app'>
                <Container>
                    <Row>
                        <Column>
                            <p>This is the home page of the App.</p>
                        </Column>
                    </Row>
                </Container>
            </Card>
        </Container>
    );
}