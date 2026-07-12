import { useState } from 'react';
import { type CreateUserDto } from '@nct/vtp-common';
import { createUser } from '../api/UsersApi';

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
                <div>
                    <label>User Login</label>
                    <br />
                    <input
                        type="text"
                        value={userCreateForm.login}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            login: event.target.value
                        })}
                    />
                </div>
                <div>
                    <label>User Name</label>
                    <br />
                    <input
                        type="text"
                        value={userCreateForm.user_name}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            user_name: event.target.value
                        })}
                    />
                </div>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}