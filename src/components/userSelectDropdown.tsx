import type { UserDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";
import { fetchUsers } from "../api/UsersApi";
import { eventBus } from "../api/EventBus";

type UserDropdownProps = {
    value: string;
    onChange: (value: string) => void;
}

export function UserDropdown({ value, onChange }: UserDropdownProps) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const data = await fetchUsers();
            setUsers(data);

            setLoading(false);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
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

    if (loading) return <p>Loading users...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading users: {error}</p>;

    if (!loading && users.length === 0) return <p>No users found.</p>;

    return (
        <div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="form-select" aria-label="Default select example"
            >
                <option value={-1} selected>Select User</option>
                {users.map((user) => (
                    <option value={user.login}>{user.user_name}</option>
                ))}
            </select>
        </div>
    );
}