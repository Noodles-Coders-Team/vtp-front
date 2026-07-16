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
        <div className='card'>
            <div className='card-body'>
                <h5 className="card-title">Delete User</h5>
                <div className="container text-center">
                    <div className="row">
                        <div className="col">
                            <UserDropdown value={userLogin} onChange={setUserLogin} />
                        </div>
                        <div className="col">
                            <button type="button" onClick={handleSubmit} className="btn btn-danger">Delete User</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}