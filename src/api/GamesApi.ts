import { CreateGameSchema, GameInfoSchema, GameSchema, GameWithInfoSchema, ValidateSchema, ValidateSchemaArray, type CreateGameDto, type GameDto, type GameInfoDto, type GameWithInfoDto } from "@nct/vtp-common";
import { get, post, put } from "./RequestApi";
import { eventBus } from "./EventBus";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/games";

export async function createGame(game: CreateGameDto): Promise<GameDto> {
    const response = await post(`${API_URL}/create`, ValidateSchema<CreateGameDto>(game, CreateGameSchema));
    const result = ValidateSchema<GameDto>(response, GameSchema);
    eventBus.dispatchEvent(new Event('GameTableShouldBeRefreshed'));
    return result;
}


export async function updateGameInfo(gameInfo: GameInfoDto): Promise<GameInfoDto> {
    const response = await put(`${API_URL}/info`, ValidateSchema<GameInfoDto>(gameInfo, GameInfoSchema));
    const result = ValidateSchema<GameInfoDto>(response, GameInfoSchema);
    return result;
}


export async function readGames(): Promise<GameDto[]> {
    const response = await get(`${API_URL}`);
    const result = ValidateSchemaArray<GameDto[]>(response, GameSchema);
    return result;
}


export async function readGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    const response = await post(`${API_URL}/with-info`, {
        can_record: can_record,
        discussed: discussed
    });
    return ValidateSchemaArray<GameWithInfoDto[]>(response, GameWithInfoSchema);
}