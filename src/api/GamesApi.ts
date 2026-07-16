import { CreateGameSchema, GameSchema, GameWithInfoSchema, type CreateGameDto, type GameDto, type GameWithInfoDto } from "@nct/vtp-common";
import { eventBus } from "./EventBus";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/games";

//TODO: this wont work 100%
export async function createGame(game: CreateGameDto): Promise<GameDto[]> {
    // Validate the form data using the CreateUserSchema
    const result = CreateGameSchema.safeParse(game);

    if (!result.success) {
        console.error(result.error);
        throw new Error(`Invalid game data: ${result.error}`);
    }

    // Send post request to the backend API with the validated data
    let response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.data)
    });

    const data = await response.json();
    const parsed = GameSchema.array().safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid game data: ${parsed.error}`);
    }

    eventBus.dispatchEvent(new Event('GameTableShouldBeRefreshed'));
    return parsed.data;;
}

export async function readGames(): Promise<GameDto[]> {
    let response = await fetch(`${API_URL}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    const data = await response.json();
    const parsed = GameSchema.array().safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid game data: ${parsed.error}`);
    }

    return parsed.data;
}


export async function readGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    let response = await fetch(`${API_URL}/with-info`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                can_record: can_record,
                discussed: discussed
            })
        }
    );

    const data = await response.json();
    const parsed = GameWithInfoSchema.array().safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid game data: ${parsed.error}`);
    }

    return parsed.data;
}