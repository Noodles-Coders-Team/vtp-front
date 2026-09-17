import {useEffect, useState} from 'react';
import {type UserDto} from '@nct/vtp-common';
import {fetchUsers} from '@api/UsersApi';
import {eventBus} from '@/api/EventBus';
import Card from '../commonComponents/Card';
import {ItemLoadingErrorState} from "@/components/commonComponents/ItemLoadingErrorState.tsx";

export function UserTable() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = () => {
        fetchUsers().then(setUsers)
            .catch(e => setError((e as Error).message))
            .finally(() => setLoading(false));
    };

    // Runs once on page load
    useEffect(() => {
        loadUsers();
    }, []);

    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener('UserTableShouldBeRefreshed', loadUsers);
        return () => {
            eventBus.removeEventListener('UserTableShouldBeRefreshed', loadUsers);
        };
    }, []);


    return (
        <Card title='User list'>
            <ItemLoadingErrorState label={"users"} loading={loading} error={error}>
                {!error && !loading &&
                    <table className='table'>
                        <thead>
                        <tr>
                            <th scope="col">Login</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Permission level</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((user) => (
                            <tr key={user.login}>
                                <td>{user.login}</td>
                                <td>{user.user_name}</td>
                                <td>{user.permission_level}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>}
            </ItemLoadingErrorState>
            <button onClick={() => {
                setError(null);
                loadUsers();
            }} className="btn btn-secondary">Refresh Data
            </button>
        </Card>
    );

}