import Card from "@commonComponents/Card";
import {Column, Container, Row} from "@commonComponents/Container";


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
                </Container>
            </Card>
        </Container>
    );
}