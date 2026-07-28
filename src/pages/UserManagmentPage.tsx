import { Column, Container, Row } from "@/components/commonComponents/Container";
import { UserLogin } from "@/components/userPageComponent/UserCreate";
import { DeleteUserByIdDropdown } from "@/components/userPageComponent/UserDelete";
import { UserTable } from "@/components/userPageComponent/UserTable";

export default function UserManagmentPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <UserLogin />
                </Column>
                <Column>
                    <UserTable />
                </Column>
            </Row>
            <Row>
                <Column>
                    <DeleteUserByIdDropdown />
                </Column>
            </Row>
        </Container>
    );
}