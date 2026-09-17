import {type SettingDto, SettingSchema, ValidateSchema} from "@nct/vtp-common";
import {get, post, postDelete, put} from "./RequestApi";
import {eventBus} from "./EventBus";


const POINT = 'settings'
const API_URL = import.meta.env.VITE_BACKEND_URL + '/' + POINT;


export async function readSettings(): Promise<SettingDto[]> {
    const rawSettings = await get(API_URL);
    return ValidateSchema<SettingDto>(rawSettings, SettingSchema, true);
}


export async function readSetting(name: string): Promise<SettingDto> {
    const rawSetting = await get(API_URL + '/' + name);
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function createSetting(body: SettingDto): Promise<SettingDto> {
    const rawSetting = await post(API_URL, body);
    eventBus.dispatchEvent(new Event('SettingsTableShouldBeRefreshed'));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function updateSetting(body: SettingDto): Promise<SettingDto> {
    const rawSetting = await put(API_URL, body);
    eventBus.dispatchEvent(new Event('SettingsTableShouldBeRefreshed'));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function deleteSettingByKey(key: string): Promise<SettingDto> {
    const rawSetting = await postDelete(API_URL + '/' + key);
    eventBus.dispatchEvent(new Event('SettingsTableShouldBeRefreshed'));
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}