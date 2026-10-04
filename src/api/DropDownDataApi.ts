import {type DropDownDto, DropDownSchema, ValidateSchema} from "@nct/vtp-common";
import {RequestApi} from "./RequestApi";
import {eventBus, EventName} from "./EventBus";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/drop-down-data/";
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;
let tagAbortController: AbortController;
let genreAbortController: AbortController;

export async function deleteDropDownData(key: string) {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    await requestApi.postDelete(abortController.signal, key);
    eventBus.dispatchEvent(new Event(EventName.DropDownDataUpdated));
}


export async function createDropDownData(body: DropDownDto) {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.post(ValidateSchema<DropDownDto>(body, DropDownSchema), abortController.signal);
    const result = ValidateSchema<DropDownDto>(response, DropDownSchema);
    eventBus.dispatchEvent(new Event(EventName.DropDownDataUpdated));
    return result;
}


export async function getAllDropDownData(): Promise<DropDownDto[]> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.get(abortController.signal);
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}


export async function getGenreDropDownData(): Promise<DropDownDto[]> {
    if (genreAbortController)
        genreAbortController.abort();
    genreAbortController = new AbortController();

    const response = await requestApi.get(genreAbortController.signal, 'genre');
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}


export async function getTagDropDownData(): Promise<DropDownDto[]> {
    if (tagAbortController)
        tagAbortController.abort();
    tagAbortController = new AbortController();

    const response = await requestApi.get(tagAbortController.signal, 'tag');
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}