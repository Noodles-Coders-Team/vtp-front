import { useState } from 'react';
import { CreateUserSchema, type CreateUserDto } from '@nct/vtp-common';
import { eventBus } from '../api/eventBus';



export function UserLogin() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [userCreateForm, setUserCreateFormForm] = useState<CreateUserDto>({
        login: '',
        name: '',
        city: ''
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();


        // Validate the form data using the CreateUserSchema
        const result = CreateUserSchema.safeParse(userCreateForm);
        if (!result.success) {
            console.error(result.error);
            return;
        }

        // Send post request to the backend API with the validated data
        await fetch(`${backendUrl}/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.data)
        });

        // Clear form after submission
        setUserCreateFormForm({
            login: '',
            name: '',
            city: ''
        });
        eventBus.dispatchEvent(new Event('userTableShouldBeRefreshed'));
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
                        value={userCreateForm.name}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            name: event.target.value
                        })}
                    />
                </div>
                <br />
                <div>
                    <label>City</label>
                    <br />
                    <input
                        type="text"
                        value={userCreateForm.city}
                        onChange={(event) => setUserCreateFormForm({
                            ...userCreateForm,
                            city: event.target.value
                        })}
                    />
                </div>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}