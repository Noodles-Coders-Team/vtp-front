import {
    type CreateGameDto,
    CreateGameSchema,
    type GameDto,
    type GameInfoDto,
    GameInfoSchema,
    GameSchema,
    type GameWithInfoDto,
    GameWithInfoSchema,
    ValidateSchema
} from "@nct/vtp-common";
import {RequestApi} from "./RequestApi";
import {eventBus, EventName} from "./EventBus";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/games/";
const requestApi = new RequestApi(API_URL);

let abortController: AbortController;

export async function createGame(game: CreateGameDto): Promise<GameDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.post(ValidateSchema<CreateGameDto>(game, CreateGameSchema), abortController.signal, 'create');
    const result = ValidateSchema<GameDto>(response, GameSchema);
    eventBus.dispatchEvent(new Event(EventName.GamesUpdated));
    return result;
}


export async function updateGameInfo(gameInfo: GameInfoDto): Promise<GameInfoDto> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.put(ValidateSchema<GameInfoDto>(gameInfo, GameInfoSchema), abortController.signal, 'info');
    return ValidateSchema<GameInfoDto>(response, GameInfoSchema);
}


export async function readGames(): Promise<GameDto[]> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.get(abortController.signal);
    return ValidateSchema<GameDto>(response, GameSchema, true);
}


export async function readGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    if (abortController)
        abortController.abort();
    abortController = new AbortController();

    const response = await requestApi.post({
            can_record: can_record,
            discussed: discussed
        },
        abortController.signal, 'with-info');
    return ValidateSchema<GameWithInfoDto>(response, GameWithInfoSchema, true);
}