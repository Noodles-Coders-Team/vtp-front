import {
    type UserGameScoreConfigDto,
    UserGameScoreConfigSchema,
    type UserSteamAppRefDataConfigDto,
    ValidateSchema
} from "@nct/vtp-common";
import {RequestApi} from "@api/RequestApi.ts";
import {getAllSteamAppRefData} from "@api/SteamAppRefDataApi.ts";
import {BACKEND_URL} from "@api/BackendUrl.ts";


const API_URL = BACKEND_URL + "/user-game-score/";
const requestApi = new RequestApi(API_URL);

let acGetAllUserGameScoreConfigs: AbortController;
let acSaveUserScoreConfig: AbortController;
let acCreateUserScoreConfig: AbortController;
let acGetAllUserScoreConfigFromDb: AbortController;
let acSaveUserMinMaxConfig: AbortController;


export async function getAllUserGameScoreConfigs(): Promise<UserGameScoreConfigDto[]> {
    if (acGetAllUserGameScoreConfigs)
        acGetAllUserGameScoreConfigs.abort();
    acGetAllUserGameScoreConfigs = new AbortController();

    const response = await requestApi.get(acGetAllUserGameScoreConfigs.signal);
    return ValidateSchema<UserGameScoreConfigDto>(response, UserGameScoreConfigSchema, true);
}


export async function getAllUserScoreConfigRefData(configId: string | null): Promise<UserGameScoreConfigDto> {
    const defaultRefData = await getAllSteamAppRefData();

    const configless: UserGameScoreConfigDto = {
        id: "", score_config: defaultRefData, score_config_label: "", user_id: ""
    };

    if (configId == null) {
        return configless;
    }
    const userConfig = await getAllUserScoreConfigFromDb(configId);
    if (userConfig == null) {
        return configless;
    }
    userConfig.score_config = defaultRefData.map((defData) => {
        const existing = userConfig.score_config.find((c) => {
            return c.id == defData.id
        });
        if (!existing)
            return defData;
        return existing;
    }) as UserSteamAppRefDataConfigDto[];

    return userConfig;
}


export async function getAllUserScoreConfigFromDb(configId: string): Promise<UserGameScoreConfigDto | null> {
    if (acGetAllUserScoreConfigFromDb)
        acGetAllUserScoreConfigFromDb.abort();
    acGetAllUserScoreConfigFromDb = new AbortController();

    const response = await requestApi.get(acGetAllUserScoreConfigFromDb.signal, `${configId}`);
    if (!response)
        return null;
    return ValidateSchema<UserGameScoreConfigDto>(response, UserGameScoreConfigSchema);
}


export async function saveUserScoreConfig(configId: string, userRefDataConfig: UserSteamAppRefDataConfigDto[]) {
    if (acSaveUserScoreConfig)
        acSaveUserScoreConfig.abort();
    acSaveUserScoreConfig = new AbortController();

    const filteredRefData = userRefDataConfig.filter(conf => conf.score != 0);
    await requestApi.post(filteredRefData, acSaveUserScoreConfig.signal, `${configId}`);
}


export async function saveUserMinMaxConfig(configId: string, minimum_reviews: number | null, positive_reviews_percentage: number | null) {
    if (acSaveUserMinMaxConfig)
        acSaveUserMinMaxConfig.abort();
    acSaveUserMinMaxConfig = new AbortController();

    await requestApi.post({
        minReviews: minimum_reviews,
        minScore: positive_reviews_percentage
    }, acSaveUserMinMaxConfig.signal, `min-max/${configId}`);
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