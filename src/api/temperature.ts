import { TemperatureSchema, type TemperatureDto } from "@nct/weather-common";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export async function deleteTemperatureById(id: string): Promise<boolean> {
    return false;
}

export async function createTemperature(temperature: TemperatureDto): Promise<boolean> {
    return false;
}

export async function fetchUserTemperature(userId: number): Promise<TemperatureDto[]> {
    return getTemperatureFromUrl(`${API_URL}/temperature/user/${userId}`);
}

export async function fetchAllTemperature(): Promise<TemperatureDto[]> {
    return getTemperatureFromUrl(`${API_URL}/temperature/`);
}

async function getTemperatureFromUrl(url: string): Promise<TemperatureDto[]> {
    const response = await fetch(url);

    if (!response.ok){
        throw new Error(`Failed to fetch temperature: ${response.statusText}`);
    }

    const data = await response.json();

    const parsed = TemperatureSchema.array().safeParse(data);

    if (!parsed.success) {
        throw new Error(`Invalid temperature data: ${parsed.error}`);
    }

    return parsed.data;
}
