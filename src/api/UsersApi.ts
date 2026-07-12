import { CreateUserSchema, UserSchema, type CreateUserDto, type UserDto } from "@nct/vtp-common";
import { eventBus } from "./EventBus";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/delete/byId/${id}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    eventBus.dispatchEvent(new Event('UserTableShouldBeRefreshed'));
}

export async function createUser(user: CreateUserDto): Promise<void> {
    // Validate the form data using the CreateUserSchema
    const result = CreateUserSchema.safeParse(user);
    
    if (!result.success) {
        console.error(result.error);
        return;
    }

    // Send post request to the backend API with the validated data
    await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.data)
    });
    eventBus.dispatchEvent(new Event('UserTableShouldBeRefreshed'));
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