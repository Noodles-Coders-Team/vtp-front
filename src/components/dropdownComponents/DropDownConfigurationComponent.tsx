import {
    createDropDownData,
    deleteDropDownData,
    getAllDropDownData,
    getGenreDropDownData,
    getTagDropDownData
} from "@api/DropDownDataApi";
import {eventBus} from "@/api/EventBus";
import type {DropDownDto} from "@nct/vtp-common";
import {useEffect, useState} from "react";
import Card from "@commonComponents/Card";
import {Column, Row} from "@commonComponents/Container";
import {InputComponent, SelectComponent} from "@commonComponents/InputComponent";
import {ItemLoadingErrorState} from "@commonComponents/ItemLoadingErrorState";
import {EventName} from "@api/EventBus";


const cleanDropDownData: DropDownDto = {
    key: '',
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


    const loadDropDownData = () => {
        let data;
        if (showOnlyTags)
            data = getTagDropDownData();
        else if (showOnlyGenres)
            data = getGenreDropDownData();
        else
            data = getAllDropDownData();
        data.then(setDropDownData)
            .catch((err) => setError((err as Error).message))
            .finally(() => setLoading(false));

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


    useEffect(() => {
        loadDropDownData();
    }, [showOnlyTags, showOnlyGenres]);


    //Runs when the user has been created
    useEffect(() => {
        eventBus.addEventListener(EventName.DropDownDataUpdated, loadDropDownData);
        return () => {
            eventBus.removeEventListener(EventName.DropDownDataUpdated, loadDropDownData);
        };
    }, []);


    const deleteData = async (key: string) => {
        deleteDropDownData(key).then(() => loadDropDownData());
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
                            onChange={(value: string) => setDropDownDataCreate({...dropDownDataCreate, value: value})}
                        />
                    </Column>
                    <Column>
                        <SelectComponent
                            id="score"
                            label="Score"
                            value={dropDownDataCreate.score.toString()}
                            onChange={(value: string) => setDropDownDataCreate({
                                ...dropDownDataCreate,
                                score: Number(value)
                            })}
                        >
                            <option value={0} selected>0</option>
                            <option value={1}>1</option>
                            <option value={-1}>-1</option>
                        </SelectComponent>
                    </Column>
                    <Column>
                        <SelectComponent id="type" label="Type" value={dropDownDataCreate.type}
                                         onChange={(value: string) => setDropDownDataCreate({
                                             ...dropDownDataCreate,
                                             type: value
                                         })}>
                            <option value={'tag'} selected>Tag</option>
                            <option value={'genre'} selected>Genre</option>
                        </SelectComponent>
                    </Column>
                    <Column style={{marginTop: 30}}>
                        <button type="submit" className="btn btn-success">Create</button>
                    </Column>
                </Row>
            </form>
            <br/>
            <Row>
                <Column>
                    <p>
                        <input type="checkbox" onChange={toggleTagOnly} checked={showOnlyTags}/>
                        Tag
                    </p>
                    <p>
                        <input type="checkbox" onChange={toggleGenreOnly} checked={showOnlyGenres}/>
                        Genre
                    </p>
                </Column>
            </Row>
            <Row>
                <ItemLoadingErrorState label="DropDown Data" loading={loading} error={error}>
                    <div className="overflow-y-scroll" style={{height: 400}}>
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
                                    <td style={{
                                        backgroundColor: getScoreColor(data.score),
                                        borderRadius: 5
                                    }}>{data.score}</td>
                                    <td style={{textTransform: "capitalize"}}>{data.type}</td>
                                    <td>
                                        <button className="btn btn-danger"
                                                onClick={() => deleteData(data.key as string)}>X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </ItemLoadingErrorState>
            </Row>
            <br/>
            <Row>
                <Column>
                    <button onClick={() => {
                        setError(null);
                        loadDropDownData();
                    }} className="btn btn-secondary">Refresh Data
                    </button>
                </Column>
            </Row>
        </Card>
    );
}