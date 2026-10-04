import {type SettingDto, SettingSchema, ValidateSchema} from "@nct/vtp-common";
import {RequestApi} from "./RequestApi";
import {eventBus, EventName} from "./EventBus";


const API_URL = import.meta.env.VITE_BACKEND_URL + '/settings/';
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;

export async function readSettings(): Promise<SettingDto[]> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const rawSettings = await requestApi.get(abortController.signal);
    return ValidateSchema<SettingDto>(rawSettings, SettingSchema, true);
}


export async function readSetting(name: string): Promise<SettingDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const rawSetting = await requestApi.get(abortController.signal, name);
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function createSetting(body: SettingDto): Promise<SettingDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const rawSetting = await requestApi.post(body, abortController.signal);
    eventBus.dispatchEvent(new Event(EventName.SettingsUpdated));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function updateSetting(body: SettingDto): Promise<SettingDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const rawSetting = await requestApi.put(body, abortController.signal);
    eventBus.dispatchEvent(new Event(EventName.SettingsUpdated));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function deleteSettingByKey(key: string): Promise<SettingDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const rawSetting = await requestApi.postDelete(abortController.signal, key);
    eventBus.dispatchEvent(new Event(EventName.SettingsUpdated));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}