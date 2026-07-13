import { useState } from "react";

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
        <>
            <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button onClick={upload}>Import CSV</button>
        </>
    );
}