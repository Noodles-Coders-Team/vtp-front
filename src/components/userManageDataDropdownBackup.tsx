import { deleteUser } from "../api/users";
import { eventBus } from "../api/eventBus";
import { useState } from "react";
import { UserDropdown } from "./userSelectDropdown";


export function DeleteUserByIdDropdown() {

    const [userId, setuserId] = useState<number>(0);

    const handleSubmit = async () => {
        // Prevent browser default form submission behavior (page reload)
            await deleteUser(userId);

        eventBus.dispatchEvent(new Event('userTableShouldBeRefreshed'));

    }

    return (
            <div>
                <h1>Delete User</h1>
                <UserDropdown value={userId.toString()} onChange={(value) => setuserId(Number(value))} />
                <button type="submit" onClick={handleSubmit}>Delete User</button>
            </div>
    );
}