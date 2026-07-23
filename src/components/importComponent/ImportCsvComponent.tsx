import { useState } from "react";
import Card from "../commonComponents/Card";
import { Column, Row } from "../commonComponents/Container";

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
            <Column>
                {responseCode == 502 &&
                    <Row style={{ color: "red" }}>
                        <Column><p>{errorMsg}</p></Column>
                    </Row>
                }
                {responseCode == 200 &&
                    <Row style={{ color: "green" }}>
                        <Column><p>Import was successful!</p></Column>
                    </Row>
                }
                {responseCode == 400 &&
                    <Row style={{ color: "orange" }}>
                        <Column><p>No import file was attached!</p></Column>
                    </Row>
                }
                <Row>
                    <Column>
                        <input
                            type="file"
                            className="form-control"
                            id={end_point + 'File'}
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </Column>
                    <Column>
                        <button onClick={upload} type="button" className="btn btn-primary">Import CSV</button>
                    </Column>
                </Row>
            </Column>
        </Card>
    );
}