import { Column, Container, Row } from "@/components/commonComponents/Container";
import { DropDownDataCreate } from "@/components/dropDownComponents/DropDownDataCreate";
import { DropDownDataTable } from "@/components/dropDownComponents/DropDownDataTable";
import { SettingsConfigurationPage } from "@/components/SettingDataTable";
import { UserLogin } from "@/components/userPageComponent/UserCreate";
import { DeleteUserByIdDropdown } from "@/components/userPageComponent/UserDelete";
import { UserTable } from "@/components/userPageComponent/UserTable";

export default function ConfigurationPage() {
    return (
        <Container>
            <Row>
                <DropDownDataCreate />
                <DropDownDataTable />
            </Row>
            <Row>
                <SettingsConfigurationPage />
            </Row>
            {/* <Row>
                <Column>
                    <UserLogin />
                </Column>
                <Column>
                    <UserTable />
                </Column>
                <Column>
                    <DeleteUserByIdDropdown />
                </Column>
            </Row> */}
        </Container>
    );
}