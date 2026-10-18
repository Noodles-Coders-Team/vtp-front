import {RequestApi} from "./RequestApi";
import {type SteamAppDto, SteamAppSchema, ValidateSchema} from "@nct/vtp-common";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/steam-apps/";
const requestApi = new RequestApi(API_URL);

let acTriggerAllGamesScheduler: AbortController;
let acTriggerAllDataScheduler: AbortController;
let acGetAllImportedApps: AbortController;


export async function triggerAllGamesScheduler(): Promise<void> {
    if (acTriggerAllGamesScheduler)
        acTriggerAllGamesScheduler.abort();
    acTriggerAllGamesScheduler = new AbortController();

    await requestApi.get(acTriggerAllGamesScheduler.signal, 'trigger-all-games-scheduler');
}

export async function triggerAllDataScheduler(): Promise<void> {
    if (acTriggerAllDataScheduler)
        acTriggerAllDataScheduler.abort();
    acTriggerAllDataScheduler = new AbortController();

    await requestApi.get(acTriggerAllDataScheduler.signal, 'trigger-all-data-scheduler');
}

export async function getAllImportedApps(page: number): Promise<SteamAppDto[]> {
    if (acGetAllImportedApps)
        acGetAllImportedApps.abort();
    acGetAllImportedApps = new AbortController();

    const response = await requestApi.get(acGetAllImportedApps.signal, `imported-apps?page=${page}`);
    if (response == undefined)
        return [];
    return ValidateSchema<SteamAppDto>(response, SteamAppSchema, true);
}