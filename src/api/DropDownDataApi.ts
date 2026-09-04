import { DropDownSchema, ValidateSchema, ValidateSchemaArray, type DropDownDto } from "@nct/vtp-common";
import { get, post, postDelete, put } from "./RequestApi";
import { eventBus } from "./EventBus";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/drop-down-data";

export async function deleteDropDownData(key: string) {
    await postDelete(`${API_URL}/${key}`);
    eventBus.dispatchEvent(new Event('DropDownTableShouldBeRefreshed'));
}


export async function createDropDownData(body: DropDownDto) {
    const response = await post(`${API_URL}/`, ValidateSchema<DropDownDto>(body, DropDownSchema));
    const result = ValidateSchema<DropDownDto>(response, DropDownSchema);
    eventBus.dispatchEvent(new Event('DropDownTableShouldBeRefreshed'));
    return result;
}


export async function getAllDropDownData(): Promise<DropDownDto[]> {
    const response = await get(`${API_URL}/`);
    return ValidateSchemaArray<DropDownDto[]>(response, DropDownSchema);
}


export async function getGenreDropDownData(): Promise<DropDownDto[]> {
    const response = await get(`${API_URL}/genre`);
    return ValidateSchemaArray<DropDownDto[]>(response, DropDownSchema);
}


export async function getTagDropDownData(): Promise<DropDownDto[]> {
    const response = await get(`${API_URL}/tag`);
    return ValidateSchemaArray<DropDownDto[]>(response, DropDownSchema);
}