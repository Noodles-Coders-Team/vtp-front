import {
    type UserGameScoreConfigDto,
    UserGameScoreConfigSchema,
    type UserSteamAppRefDataConfigDto,
    ValidateSchema
} from "@nct/vtp-common";
import {RequestApi} from "@api/RequestApi.ts";
import {getAllSteamAppRefData} from "@api/SteamAppRefDataApi.ts";


const API_URL = import.meta.env.VITE_BACKEND_URL + "/user-game-score/";
const requestApi = new RequestApi(API_URL);

let acGetAllUserGameScoreConfigs: AbortController;
let acSaveUserScoreConfig: AbortController;
let acCreateUserScoreConfig: AbortController;
let acGetAllUserScoreConfigRefDataFromDb: AbortController;


export async function getAllUserGameScoreConfigs(): Promise<UserGameScoreConfigDto[]> {
    if (acGetAllUserGameScoreConfigs)
        acGetAllUserGameScoreConfigs.abort();
    acGetAllUserGameScoreConfigs = new AbortController();

    const response = await requestApi.get(acGetAllUserGameScoreConfigs.signal);
    return ValidateSchema<UserGameScoreConfigDto>(response, UserGameScoreConfigSchema, true);
}


export async function getAllUserScoreConfigRefData(configId: string | null): Promise<UserSteamAppRefDataConfigDto[]> {
    const defaultRefData = await getAllSteamAppRefData();

    if (configId == null) {
        return defaultRefData;
    }
    const userConfig = await getAllUserScoreConfigRefDataFromDb(configId);
    if (userConfig.length == 0) {
        return defaultRefData;
    }
    return defaultRefData.map((defData) => {
        const existing = userConfig.find((c) => {
            return c.id == defData.id
        });
        if (!existing)
            return defData;
        return existing;
    }) as UserSteamAppRefDataConfigDto[];
}


export async function getAllUserScoreConfigRefDataFromDb(configId: string): Promise<UserSteamAppRefDataConfigDto[]> {
    if (acGetAllUserScoreConfigRefDataFromDb)
        acGetAllUserScoreConfigRefDataFromDb.abort();
    acGetAllUserScoreConfigRefDataFromDb = new AbortController();

    const response = await requestApi.get(acGetAllUserScoreConfigRefDataFromDb.signal, `${configId}`);
    const dto = ValidateSchema<UserGameScoreConfigDto>(response, UserGameScoreConfigSchema);
    return dto.score_config;
}


export async function saveUserScoreConfig(configId: string, userRefDataConfig: UserSteamAppRefDataConfigDto[]) {
    if (acSaveUserScoreConfig)
        acSaveUserScoreConfig.abort();
    acSaveUserScoreConfig = new AbortController();

    const filteredRefData = userRefDataConfig.filter(conf => conf.score != 0);
    await requestApi.post(filteredRefData, acSaveUserScoreConfig.signal, `${configId}`);
}


export async function createUserScoreConfig(configName: string): Promise<string> {
    if (acCreateUserScoreConfig)
        acCreateUserScoreConfig.abort();
    acCreateUserScoreConfig = new AbortController();

    const response = await requestApi.post({}, acCreateUserScoreConfig.signal, `create/${configName}`) as {
        configId: string
    };
    return response.configId;
}