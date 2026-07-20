import ImportCsvComponent from "@/components/importComponent/ImportCsvComponent";

export default function ImportPage() {

    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <ImportCsvComponent title={"Import Games from Google sheets"} end_point={"games"} description={""} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <ImportCsvComponent title={"Import channel Data from YT"} end_point={"channel-data"} description={""} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <ImportCsvComponent title={"Import Table Data from YT"} end_point={"table-data"} description={""} />
                </div>
            </div>
        </div>
    );
}