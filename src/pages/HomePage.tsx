import Card from "@commonComponents/Card";
import {Column, Container, Row} from "@commonComponents/Container";


export default function HomePage() {

    return (
        <Container>
            <Row>
                <Card title='Welcome to the Video Tracking & Planning app'>
                    <Row>
                        <Column>
                            <p>This is the home page of the App.</p>
                        </Column>
                    </Row>
                </Card>
            </Row>
        </Container>
    );
}