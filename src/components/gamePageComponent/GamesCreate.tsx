import { createGame } from "@/api/GamesApi";
import type { CreateGameDto } from "@nct/vtp-common";
import { useState } from "react";

const cleanGame: CreateGameDto = {
    name: '',
    recorded: false,
    release_date: null,
    link: null,
}

export default function GamesCreate() {

    const [createGameForm, setCreateGameForm] = useState<CreateGameDto>(cleanGame);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();

        createGame(createGameForm);
        // Clear form after submission
        setCreateGameForm(cleanGame);
    }

    return (
        <div className='card'>
            <div className='card-body'>
                <h5 className='card-title'>Create Game</h5>
                <div className="overflow-y-scroll" style={{ height: 500 }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label htmlFor="gameName" className="col-sm-2 col-form-label">Name Title</label>
                            <div className="col-sm-10">
                                <input
                                    className="form-control"
                                    id="gameName"
                                    placeholder="Minecraft"
                                    type="text"
                                    value={createGameForm.name}
                                    onChange={(event) => setCreateGameForm({
                                        ...createGameForm,
                                        name: event.target.value
                                    })}
                                    />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="userName" className="col-sm-2 col-form-label">Link</label>
                            <div className="col-sm-10">
                                <input
                                    className="form-control"
                                    id="userName"
                                    placeholder="Very Cool Name"
                                    type="text"
                                    value={createGameForm.link ?? ''}
                                    onChange={(event) => setCreateGameForm({
                                        ...createGameForm,
                                        link: event.target.value
                                    })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </form>
                </div>
            </div>
        </div>
    )
}