import {RequestApi} from "./RequestApi";
import {type SteamAppDto, SteamAppSchema, ValidateSchema} from "@nct/vtp-common";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/steam-apps/";
const requestApi = new RequestApi(API_URL);

let acTriggerAllGamesScheduler: AbortController;
let acTriggerAllDataScheduler: AbortController;
let acTriggerAllTagsScheduler: AbortController;
let acGetAllImportedApps: AbortController;


export async function triggerAllGamesScheduler(): Promise<boolean> {
    if (acTriggerAllGamesScheduler)
        acTriggerAllGamesScheduler.abort();
    acTriggerAllGamesScheduler = new AbortController();

    const response = await requestApi.get(acTriggerAllGamesScheduler.signal, 'trigger-all-games-scheduler');
    return (response as SchedulerStatus).isActive;
}


export async function getAllGamesSchedulerStatus(): Promise<boolean> {
    const response = await requestApi.get(new AbortController().signal, 'all-games-scheduler-status');
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
    return (response as SchedulerStatus).isActive;
}


export async function triggerAllTagsScheduler(): Promise<boolean> {
    if (acTriggerAllTagsScheduler)
        acTriggerAllTagsScheduler.abort();
    acTriggerAllTagsScheduler = new AbortController();

    const response = await requestApi.get(acTriggerAllTagsScheduler.signal, 'trigger-all-tags-scheduler');
    return (response as SchedulerStatus).isActive;
}


export async function getAllTagsSchedulerStatus(): Promise<boolean> {
    const response = await requestApi.get(new AbortController().signal, 'all-tags-scheduler-status');
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


interface SchedulerStatus {
    isActive: boolean
}