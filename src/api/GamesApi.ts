import { CreateGameSchema, GameInfoSchema, GameSchema, GameWithInfoSchema, type CreateGameDto, type GameDto, type GameInfoDto, type GameWithInfoDto } from "@nct/vtp-common";
import { eventBus } from "./EventBus";
import { validateSchema, validateSchemaArray } from "./Validators";
import { get, post, put } from "./RequestApi";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/games";

export async function createGame(game: CreateGameDto): Promise<GameDto> {
    const response = await post(`${API_URL}/create`, validateSchema<CreateGameDto>(CreateGameSchema, game));
    const result = validateSchema<GameDto>(GameSchema, response);
    eventBus.dispatchEvent(new Event('GameTableShouldBeRefreshed'));
    return result;
}


export async function updateGameInfo(gameInfo: GameInfoDto): Promise<GameInfoDto> {
    const response = await put(`${API_URL}/info`, validateSchema<GameInfoDto>(GameInfoSchema, gameInfo));
    const result = validateSchema<GameInfoDto>(GameInfoSchema, response);
    eventBus.dispatchEvent(new Event('GameTableShouldBeRefreshed'));
    return result;
}


export async function readGames(): Promise<GameDto[]> {
    const response = await get(`${API_URL}`);
    const result = validateSchemaArray<GameDto[]>(GameSchema, response);
    return result;
}


export async function readGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    const response = await post(`${API_URL}/with-info`, {
        can_record: can_record,
        discussed: discussed
    });
    return validateSchemaArray<GameWithInfoDto[]>(GameWithInfoSchema, response);
}