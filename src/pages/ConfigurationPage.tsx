import { Column, Container, Row } from "@/components/commonComponents/Container";
import { DropDownConfigurationComponent } from "@/components/dropdownComponents/DropDownConfigurationComponent";
import { SettingsConfigurationPage } from "@/components/SettingDataTable";

export default function ConfigurationPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <DropDownConfigurationComponent />
                </Column>
            </Row>
            <Row>
                <Column>
                    <SettingsConfigurationPage />
                </Column>
            </Row>
        </Container>
    );
}