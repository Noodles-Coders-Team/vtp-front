import { UserSchema, type UserDto } from "@nct/weather-common";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/delete/byId/${id}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
}

export async function fetchUsers(): Promise<UserDto[]> {
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();

    const parsed = UserSchema.array().safeParse(data);
    
    if (!parsed.success) {
        throw new Error(`Invalid user data: ${parsed.error}`);
    }

    return parsed.data;
};