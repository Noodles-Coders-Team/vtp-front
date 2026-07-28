import { deleteUser } from "../../api/UsersApi";
import { useState } from "react";
import { UserDropdown } from "../userComponent/UserSelectDropdown";
import Card from "../commonComponents/Card";
import { Column, Container, Row } from "../commonComponents/Container";


export function DeleteUserByIdDropdown() {

    const [userLogin, setUserLogin] = useState<string>('');

    const handleSubmit = async () => {
        // Prevent browser default form submission behavior (page reload)
        await deleteUser(userLogin);
    }

    return (
        <Card title='Delete User'>
            <Container>
                <Row>
                    <Column>
                        <UserDropdown value={userLogin} onChange={setUserLogin} />
                    </Column>
                    <Column>
                        <button type="button" onClick={handleSubmit} className="btn btn-danger">Delete User</button>
                    </Column>
                </Row>
            </Container>
        </Card>
    );
}