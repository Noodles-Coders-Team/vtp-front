import {RequestApi} from "./RequestApi";
import {type SteamAppDto, SteamAppSchema, type UserSteamAppRefDataConfigDto, ValidateSchema} from "@nct/vtp-common";
import {BACKEND_URL} from "./BackendUrl.ts";


const API_URL = BACKEND_URL + "/steam-apps/";
const requestApi = new RequestApi(API_URL);


let acTriggerAllGamesScheduler: AbortController;
let acTriggerAllDataScheduler: AbortController;
let acGetAllImportedApps: AbortController;
let acCallSteamAppCalculated: AbortController;
let acGetGamesFilteredByConfigId: AbortController;


export async function triggerAllGamesScheduler(): Promise<boolean> {
    if (acTriggerAllGamesScheduler)
        acTriggerAllGamesScheduler.abort();
    acTriggerAllGamesScheduler = new AbortController();

    const response = await requestApi.get(acTriggerAllGamesScheduler.signal, 'trigger-all-games-scheduler');
    return (response as SchedulerStatus).isActive;
}


export async function getAllGamesSchedulerStatus(): Promise<boolean> {
    const response = await requestApi.get(new AbortController().signal, 'all-games-scheduler-status');
    if (response == null)
        return false;
    return (response as SchedulerStatus).isActive;
}


export async function triggerAllDataScheduler(): Promise<boolean> {
    if (acTriggerAllDataScheduler)
        acTriggerAllDataScheduler.abort();
    acTriggerAllDataScheduler = new AbortController();

    const response = await requestApi.get(acTriggerAllDataScheduler.signal, 'trigger-all-data-scheduler');
    return (response as SchedulerStatus).isActive;
}


export async function getAllDataSchedulerStatus(): Promise<boolean> {
    const response = await requestApi.get(new AbortController().signal, 'all-data-scheduler-status');
    if (response == null)
        return false;
    return (response as SchedulerStatus).isActive;
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


export async function getGamesFilteredByRefData(refData: UserSteamAppRefDataConfigDto[]): Promise<SteamAppDto[]> {
    if (acCallSteamAppCalculated)
        acCallSteamAppCalculated.abort();
    acCallSteamAppCalculated = new AbortController();

    const filteredRefData = refData.filter(ref => ref.score != 0);
    const response = await requestApi.post(filteredRefData, acCallSteamAppCalculated.signal, `apps-filtered-with-user-config`);
    if (response == undefined)
        return [];
    return ValidateSchema<SteamAppDto>(response, SteamAppSchema, true);
}


export async function getGamesFilteredByConfigId(configId: string): Promise<SteamAppDto[]> {
    if (acGetGamesFilteredByConfigId)
        acGetGamesFilteredByConfigId.abort();
    acGetGamesFilteredByConfigId = new AbortController();

    const response = await requestApi.get(acGetGamesFilteredByConfigId.signal, `filter-apps-by-config/${configId}`);
    if (response == undefined)
        return [];
    return ValidateSchema<SteamAppDto>(response, SteamAppSchema, true);
}


interface SchedulerStatus {
    isActive: boolean
}