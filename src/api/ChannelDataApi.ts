import { ChannelDataSchema, type ChannelDataDto } from "@nct/vtp-common";
import { get } from "./RequestApi";
import { validateSchemaArray } from "./Validators";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/channel-data";

export async function readChannelData(): Promise<ChannelDataDto[]> {
    const response = await get(API_URL);
    const result = validateSchemaArray<ChannelDataDto[]>(ChannelDataSchema, response);
    return result;
}