import { createDropDownData, deleteDropDownData, getAllDropDownData, getGenreDropDownData, getTagDropDownData } from "@/api/DropDownDataApi";
import { eventBus } from "@/api/EventBus";
import type { DropDownDto } from "@nct/vtp-common";
import { useEffect, useState } from "react";
import Card from "../commonComponents/Card";
import { Column, Row } from "../commonComponents/Container";
import { InputComponent } from "../commonComponents/InputComponent";


const cleanDropDownData: DropDownDto = {
    value: '',
    type: 'tag',
    score: 0
}


export function DropDownConfigurationComponent() {
    const [dropDownData, setDropDownData] = useState<DropDownDto[]>([]);
    const [showOnlyTags, setShowOnlyTags] = useState<boolean>(false);
    const [showOnlyGenres, setShowOnlyGenres] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dropDownDataCreate, setDropDownDataCreate] = useState<DropDownDto>(cleanDropDownData);

    const loadDropDownData = async () => {
        try {
            setLoading(true);
            let data;
            if (showOnlyTags)
                data = await getTagDropDownData();
            else if (showOnlyGenres)
                data = await getGenreDropDownData();
            else
                data = await getAllDropDownData();
            setDropDownData(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };


    const toggleTagOnly = () => {
        setShowOnlyTags(!showOnlyTags);
        setShowOnlyGenres(false);
    };

    const toggleGenreOnly = () => {
        setShowOnlyTags(false);
        setShowOnlyGenres(!showOnlyGenres);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();
        createDropDownData(dropDownDataCreate);

        // Clear form after submission
        setDropDownDataCreate(cleanDropDownData);
    };


    // Runs once on page load
    useEffect(() => {
        loadDropDownData();
    }, []);

    useEffect(() => {
        loadDropDownData();
    }, [showOnlyTags, showOnlyGenres]);

    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener('DropDownTableShouldBeRefreshed', loadDropDownData);
        return () => {
            eventBus.removeEventListener('DropDownTableShouldBeRefreshed', loadDropDownData);
        };
    }, []);

    if (loading) return <p>Loading DropDown Data...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading DropDown data: {error}</p>;

    if (!loading && dropDownData.length === 0) return <p>No DropDown data found.</p>;

    const deleteData = async (key: string) => {
        deleteDropDownData(key);
    };

    const getScoreColor = (score: number): string => {
        if (score == -1)
            return "red";
        else if (score == 0)
            return "orange";
        else if (score == 1)
            return "green";
        else
            return "pink";
    };

    return (
        <Card title='DropDown Data List'>
            <form onSubmit={handleSubmit}>
                <Row>
                    <Column>
                        <InputComponent
                            id="value"
                            label="Value"
                            placeholder="RPG"
                            value={dropDownDataCreate.value}
                            onChange={(value: string) => setDropDownDataCreate({ ...dropDownDataCreate, value: value })}
                        />
                    </Column>
                    <Column>
                        <label htmlFor="score" className="col-sm-2 col-form-label">Score</label>
                        <div className="col-sm-10">
                            <select
                                id="score"
                                value={dropDownDataCreate.score}
                                onChange={(event) => setDropDownDataCreate({
                                    ...dropDownDataCreate,
                                    score: Number(event.target.value)
                                })}
                                className="form-select" aria-label="Default select example"
                            >
                                <option value={0} selected>0</option>
                                <option value={1}>1</option>
                                <option value={-1}>-1</option>
                            </select>
                        </div>
                    </Column>
                    <Column>
                        <label htmlFor="type" className="col-sm-2 col-form-label">Type</label>
                        <div className="col-sm-10">
                            <select
                                id="type"
                                value={dropDownDataCreate.type}
                                onChange={(event) => setDropDownDataCreate({
                                    ...dropDownDataCreate,
                                    type: event.target.value
                                })}
                                className="form-select" aria-label="Default select example"
                            >
                                <option value={'tag'} selected>Tag</option>
                                <option value={'genre'} selected>Genre</option>
                            </select>
                        </div>
                    </Column>
                    <Column>
                        <button type="submit" className="btn btn-success">Create</button>
                    </Column>
                </Row>
            </form>
            <br />
            <div style={{ alignContent: "end" }}>
                <p>
                    <input type="checkbox" onChange={toggleTagOnly} checked={showOnlyTags} />
                    Tag
                </p>
                <p>
                    <input type="checkbox" onChange={toggleGenreOnly} checked={showOnlyGenres} />
                    Genre
                </p>
            </div>
            <div className="overflow-y-scroll" style={{ height: 400 }}>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">Value</th>
                            <th scope="col">Score</th>
                            <th scope="col">Type</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {dropDownData.map((data) => (
                            <tr key={data.key}>
                                <td>{data.value}</td>
                                <td style={{ backgroundColor: getScoreColor(data.score), borderRadius: 5 }}>{data.score}</td>
                                <td style={{ textTransform: "capitalize" }}>{data.type}</td>
                                <td><button className="btn btn-danger" onClick={() => deleteData(data.key as string)}>X</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <button onClick={loadDropDownData} className="btn btn-secondary">Refresh Data</button>
        </Card>
    );
}