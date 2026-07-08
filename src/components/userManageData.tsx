import { deleteUser } from "../api/users";
import { eventBus } from "../api/eventBus";
import { useState } from "react";


export function DeleteUserById() {

    const [userId, setuserId] = useState<number>(0);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();

            await deleteUser(userId);

        eventBus.dispatchEvent(new Event('userTableShouldBeRefreshed'));

    }

    return (
            <div>
                <h1>Delete User</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>User ID</label>
                        <br />
                        <input
                            type="text"
                            value={userId}
                            onChange={(event) => setuserId(Number(event.target.value))}
                        />
                    </div>
                    <button type="submit">Delete User</button>
                </form>
            </div>
    );
}