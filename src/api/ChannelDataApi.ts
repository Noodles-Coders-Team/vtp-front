import {type ChannelDataDto, ChannelDataSchema, ValidateSchema} from "@nct/vtp-common";
import {RequestApi} from "./RequestApi";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/channel-data/";
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;

export async function readChannelData(): Promise<ChannelDataDto[]> {
    if(abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.get(abortController.signal);
    return ValidateSchema<ChannelDataDto>(response, ChannelDataSchema, true);
}