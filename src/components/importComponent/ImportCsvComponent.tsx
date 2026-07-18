import { useState } from "react";
import Card from "../commonComponents/Card";

interface ImportCsvProps {
    title: string,
    end_point: string,
    description: string
}

const API_URL = import.meta.env.VITE_BACKEND_URL + "/import";

export default function ImportCsvComponent({title, end_point, description}: ImportCsvProps) {
    const [file, setFile] = useState<File | null>(null);

    const upload = async () => {
        if (!file)
            return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/${end_point}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data);
    }

    return (
        <Card title={title}>
        <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <input
                            type="file"
                            className="form-control"
                            id={end_point+'File'}
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