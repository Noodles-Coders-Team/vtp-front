import {type CreateUserDto, CreateUserSchema, type UserDto, UserSchema, ValidateSchema} from "@nct/vtp-common";
import {eventBus} from "./EventBus";
import {get, post} from "./RequestApi";

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
    return ValidateSchema<UserDto>(response, UserSchema, true);
}