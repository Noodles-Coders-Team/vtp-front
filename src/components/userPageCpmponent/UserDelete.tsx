import { deleteUser } from "../../api/UsersApi";
import { useState } from "react";
import { UserDropdown } from "../userComponent/UserSelectDropdown";


export function DeleteUserByIdDropdown() {

    const [userLogin, setUserLogin] = useState<string>('');

    const handleSubmit = async () => {
        // Prevent browser default form submission behavior (page reload)
        await deleteUser(userLogin);
    }

    return (
        <div className="container text-center">
            <div className="row">
                <h1>Delete User</h1>
            </div>
            <div className="row">
                <div className="col">
                    <UserDropdown value={userLogin} onChange={setUserLogin} />
                </div>
                <div className="col">
                    <button type="button" onClick={handleSubmit} className="btn btn-danger">Delete User</button>
                </div>
            </div>
        </div>
    );
}