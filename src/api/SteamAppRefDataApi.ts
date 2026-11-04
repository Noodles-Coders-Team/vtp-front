import {RequestApi} from "./RequestApi";
import {type UserSteamAppRefDataConfigDto, UserSteamAppRefDataConfigSchema, ValidateSchema} from "@nct/vtp-common";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/steam-app-ref-data/";
const requestApi = new RequestApi(API_URL);


let acGetAllSteamAppRefData: AbortController;
let acUpdateAllSteamAppRefData: AbortController;


export async function getAllSteamAppRefData(): Promise<UserSteamAppRefDataConfigDto[]> {
    if (acGetAllSteamAppRefData)
        acGetAllSteamAppRefData.abort();
    acGetAllSteamAppRefData = new AbortController();

    const response = await requestApi.get(acGetAllSteamAppRefData.signal);
    return ValidateSchema<UserSteamAppRefDataConfigDto>(response, UserSteamAppRefDataConfigSchema, true);
}


export async function updateAllSteamAppRefData(): Promise<void> {
    if (acUpdateAllSteamAppRefData)
        acUpdateAllSteamAppRefData.abort();
    acUpdateAllSteamAppRefData = new AbortController();

    await requestApi.get(acUpdateAllSteamAppRefData.signal, "update");
}