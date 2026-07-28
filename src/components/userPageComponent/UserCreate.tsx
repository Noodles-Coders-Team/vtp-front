import { useState } from 'react';
import { type CreateUserDto } from '@nct/vtp-common';
import { createUser } from '@api/UsersApi';
import Card from '../commonComponents/Card';

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
        <Card title='Create User'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <label htmlFor="userLogin" className="col-sm-2 col-form-label">User Login</label>
                    <div className="col-sm-10">
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
                </div>
                <div className="mb-3 row">
                    <label htmlFor="userName" className="col-sm-2 col-form-label">User Name</label>
                    <div className="col-sm-10">
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
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </Card>
    )
}