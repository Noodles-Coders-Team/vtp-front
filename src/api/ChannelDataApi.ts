import {type ChannelDataDto, ChannelDataSchema, ValidateSchema} from "@nct/vtp-common";
import {get} from "./RequestApi";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/channel-data";

export async function readChannelData(): Promise<ChannelDataDto[]> {
    const response = await get(API_URL);
    return ValidateSchema<ChannelDataDto>(response, ChannelDataSchema, true);
}