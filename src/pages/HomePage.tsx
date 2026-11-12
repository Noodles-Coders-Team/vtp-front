import Card from "@commonComponents/Card";
import {Column, Row} from "@commonComponents/Container";


export default function HomePage() {

    return (
        <Card title='Welcome to the Video Tracking & Planning app' style={{width: '45%'}}>
            <Row>
                <Column>
                    <p>This is the home page of the App.</p>
                </Column>
            </Row>
        </Card>
    );
}