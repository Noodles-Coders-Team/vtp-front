import ImportGame from "@/components/ImportGame";

export default function ImportPage() {

    return (
        <div className="container text-center">
            <div className="row">
                <h1>Import Page</h1>
            </div>
            <div className="row">
                <div className="col">
                    <h3> Import Games from Google sheets</h3>
                </div>
                <div className="col">
                    <ImportGame />
                </div>
            </div>
        </div>
    );
}