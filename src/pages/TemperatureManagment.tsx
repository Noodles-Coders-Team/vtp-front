import { useEffect } from "react";
import { AllTemperatureTable } from "../components/temperatureTable/temperatureTableAll"
import { AllTemperatureTableWithUserFilter } from "../components/temperatureTable/temperatureTableWithUserFilter";


export default function TemperatureManagment() {
    useEffect(() => {
        document.title = "Weather Control - Temperature";
    });


    return (
        <div className="container text-center">
            <div className="row">
                <h1>Temperature Management</h1>
            </div>
            <div className="row">
                {/* <AllTemperatureTable /> */}
                <AllTemperatureTableWithUserFilter />
            </div>
        </div>
    )
}