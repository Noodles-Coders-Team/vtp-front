import { useState } from "react";
import Card from "../commonComponents/Card";

interface ImportCsvProps {
    title: string,
    end_point: string,
    description: string
}

const API_URL = import.meta.env.VITE_BACKEND_URL + "/import";

export default function ImportCsvComponent({ title, end_point, description }: ImportCsvProps) {
    const [file, setFile] = useState<File | null>(null);
    const [responseCode, setResponseCode] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const upload = async () => {
        if (!file)
            return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/${end_point}`, {
            method: 'POST',
            body: formData
        });

        const responseBody = await response.json();

        if (response.status == 500) {
            setErrorMsg(responseBody['message']);
        }

        setResponseCode(response.status);
    }

    return (
        <Card title={title}>
            <div className="container text-center">
                {responseCode == 502 &&
                    <div className="row" style={{ color: "red" }}>
                        <p>{errorMsg}</p>
                    </div>
                }
                {responseCode == 200 &&
                    <div className="row" style={{ color: "green" }}>
                        <p>Import was successful!</p>
                    </div>
                }
                {responseCode == 400 &&
                    <div className="row" style={{ color: "orange" }}>
                        <p>No import file was attached!</p>
                    </div>
                }
                <div className="row">
                    <div className="col">
                        <input
                            type="file"
                            className="form-control"
                            id={end_point + 'File'}
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