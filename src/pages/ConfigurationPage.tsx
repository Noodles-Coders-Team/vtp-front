import {Column, Container, Row} from "@commonComponents/Container";
import {SettingsConfigurationPage} from "@components/SettingDataTable";


export default function ConfigurationPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <SettingsConfigurationPage/>
                </Column>
            </Row>
        </Container>
    );
}