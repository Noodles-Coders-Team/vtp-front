import { Column, Container, Row } from "@/components/commonComponents/Container";
import { UserLogin } from "@/components/userPageCpmponent/UserCreate";
import { DeleteUserByIdDropdown } from "@/components/userPageCpmponent/UserDelete";
import { UserTable } from "@/components/userPageCpmponent/UserTable";

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