import GamesCreate from "@/components/gamePageComponent/GamesCreate";
import GamesTable from "@/components/gamePageComponent/GamesTable";


export default function GamesPage() {
    return (
        <div className="container text-center">
            <div className="row g-5">
                <div className="col">
                    <GamesTable />
                </div>
            </div>
            <div className="row g-5">
                <div className="col">
                    <GamesCreate />
                </div>
            </div>
        </div>
    )
}