import { CreateUserSchema, UserSchema, ValidateSchema, ValidateSchemaArray, type CreateUserDto, type UserDto } from "@nct/vtp-common";
import { eventBus } from "./EventBus";
import { post, get } from "./RequestApi";

const API_URL = import.meta.env.VITE_BACKEND_URL + '/users';

export async function deleteUser(id: string): Promise<void> {
    await post(`${API_URL}/delete/byId/${id}`);
    eventBus.dispatchEvent(new Event('UserTableShouldBeRefreshed'));
}


export async function createUser(user: CreateUserDto): Promise<void> {
    await post(`${API_URL}/create`, ValidateSchema<CreateUserDto>(user, CreateUserSchema));
    eventBus.dispatchEvent(new Event('UserTableShouldBeRefreshed'));
}


export async function fetchUsers(): Promise<UserDto[]> {
    const response = await get(`${API_URL}`);
    return  ValidateSchemaArray<UserDto[]>(response, UserSchema);
};