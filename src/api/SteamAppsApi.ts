import {RequestApi} from "./RequestApi";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/steam-apps/";
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;


export async function triggerAllGamesScheduler(): Promise<void> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    await requestApi.get(abortController.signal, 'trigger-all-games-scheduler');
}

export async function triggerAllDataScheduler(): Promise<void> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    await requestApi.get(abortController.signal, 'trigger-all-data-scheduler');
}