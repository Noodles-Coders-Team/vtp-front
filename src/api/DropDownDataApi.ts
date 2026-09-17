import {type DropDownDto, DropDownSchema, ValidateSchema} from "@nct/vtp-common";
import {get, post, postDelete} from "./RequestApi";
import {eventBus} from "./EventBus";

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
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}


export async function getGenreDropDownData(): Promise<DropDownDto[]> {
    const response = await get(`${API_URL}/genre`);
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}


export async function getTagDropDownData(): Promise<DropDownDto[]> {
    const response = await get(`${API_URL}/tag`);
    return ValidateSchema<DropDownDto>(response, DropDownSchema, true);
}