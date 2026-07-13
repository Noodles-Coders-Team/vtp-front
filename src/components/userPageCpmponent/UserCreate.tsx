import { useState } from 'react';
import { type CreateUserDto } from '@nct/vtp-common';
import { createUser } from '@api/UsersApi';

const cleanUser: CreateUserDto = {
    login: '',
    user_name: '',
    permission_level: '',
}

export function UserLogin() {
    const [userCreateForm, setUserCreateFormForm] = useState<CreateUserDto>(cleanUser);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();
        createUser(userCreateForm);

        // Clear form after submission
        setUserCreateFormForm(cleanUser);
    };

    return (
        <div>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="userLogin" className="form-label">User Login</label>
                    <input
                        className="form-control"
                        id="userLogin"
                        placeholder="super_user_com"
                        type="text"
                        value={userCreateForm.login}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            login: event.target.value
                        })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="userName" className="form-label">User Name</label>
                    <input
                        className="form-control"
                        id="userName"
                        placeholder="Very Cool Name"
                        type="text"
                        value={userCreateForm.user_name}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            user_name: event.target.value
                        })}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    )
}