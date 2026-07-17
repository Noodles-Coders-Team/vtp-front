import { useState } from "react";
import Card from "./commonComponents/Card";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/import";

export default function ImportGame() {
    const [file, setFile] = useState<File | null>(null);

    const upload = async () => {
        if (!file)
            return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data);
    }

    return (
        <Card title="Import Games from Google sheets">
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <input
                            type="file"
                            className="form-control"
                            id='gamesFile'
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <div className="col">
                        <button onClick={upload} type="button" className="btn btn-primary">Import CSV</button>
                    </div>
                </div>
            </ div>
        </Card>
    );
}