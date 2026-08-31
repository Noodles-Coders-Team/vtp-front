import { SettingSchema, ValidateSchema, ValidateSchemaArray, type SettingDto } from "@nct/vtp-common";
import { get, post, put } from "./RequestApi";


const POINT = 'settings'
const API_URL = import.meta.env.VITE_BACKEND_URL + '/' + POINT;


export async function readSettings(): Promise<SettingDto[]> {
    const rawSettings = await get(API_URL);
    return ValidateSchemaArray<SettingDto[]>(rawSettings, SettingSchema);
}


export async function readSetting(name: string): Promise<SettingDto> {
    const rawSetting = await get(API_URL + '/' + name);
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function createSetting(body: SettingDto): Promise<SettingDto> {
    const rawSetting = post(API_URL, body);
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}


export async function updateSetting(body: SettingDto): Promise<SettingDto> {
    const rawSetting = put(API_URL, body);
    return ValidateSchema<SettingDto>(rawSetting, SettingSchema);
}