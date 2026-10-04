import {type UserDto, UserSchema, ValidateSchema} from "@nct/vtp-common";
import {eventBus, EventName} from "./EventBus";
import {RequestApi} from "./RequestApi";


const API_URL = import.meta.env.VITE_BACKEND_URL + '/users/';
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;

export async function deleteUser(id: string): Promise<void> {
    if(abortController)
        abortController.abort();
    abortController = new AbortController();

    await requestApi.post({}, abortController.signal,`delete/byId/${id}`);
    eventBus.dispatchEvent(new Event(EventName.UsersUpdated));
}


export async function createUser(user: UserDto): Promise<void> {
    if(abortController)
        abortController.abort();
    abortController = new AbortController();

    await requestApi.post(ValidateSchema<UserDto>(user, UserSchema), abortController.signal, `create`);
    eventBus.dispatchEvent(new Event(EventName.UsersUpdated));
}


export async function fetchUsers(): Promise<UserDto[]> {
    if(abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.get(abortController.signal);
    return ValidateSchema<UserDto>(response, UserSchema, true);
}