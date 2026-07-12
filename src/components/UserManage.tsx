import { deleteUser } from "../api/UsersApi";
import { useState } from "react";
import { UserDropdown } from "./UserSelectDropdown";


export function DeleteUserByIdDropdown() {

    const [userLogin, setUserLogin] = useState<string>('');

    const handleSubmit = async () => {
        // Prevent browser default form submission behavior (page reload)
        await deleteUser(userLogin);
    }

    return (
        <div>
            <h1>Delete User</h1>
            <UserDropdown value={userLogin} onChange={setUserLogin} />
            <button type="submit" onClick={handleSubmit}>Delete User</button>
        </div>
    );
}