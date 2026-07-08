import type { UserDto } from "@nct/weather-common";
import { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { eventBus } from "../api/eventBus";

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
        eventBus.addEventListener('userTableShouldBeRefreshed', loadUsers);
        return () => {
            eventBus.removeEventListener('userTableShouldBeRefreshed', loadUsers);
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
                    <option value={user.id}>{user.name}</option>
                ))}
            </select>
        </div>
    );
}