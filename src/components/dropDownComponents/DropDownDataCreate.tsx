import { useState } from 'react';
import { type DropDownDto } from '@nct/vtp-common';
import Card from '../commonComponents/Card';
import { createDropDownData } from '@/api/DropDownDataApi';

const cleanDropDownData: DropDownDto = {
    value: '',
    type: 'tag',
    score: 0
}

export function DropDownDataCreate() {
    const [dropDownData, setDropDownData] = useState<DropDownDto>(cleanDropDownData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent browser default form submission behavior (page reload)
        event.preventDefault();
        createDropDownData(dropDownData);

        // Clear form after submission
        setDropDownData(cleanDropDownData);
    };

    return (
        <Card title='Create DropDown Data'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <label htmlFor="value" className="col-sm-2 col-form-label">Value</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            id="value"
                            placeholder="RPG"
                            type="text"
                            value={dropDownData.value}
                            onChange={(event) => setDropDownData({
                                ...dropDownData,
                                value: event.target.value
                            })}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="score" className="col-sm-2 col-form-label">Score</label>
                    <div className="col-sm-10">
                        <select
                            id="score"
                            value={dropDownData.score}
                            onChange={(event) => setDropDownData({
                                ...dropDownData,
                                score: Number(event.target.value)
                            })}
                            className="form-select" aria-label="Default select example"
                        >
                            <option value={0} selected>0</option>
                            <option value={1}>1</option>
                            <option value={-1}>-1</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="type" className="col-sm-2 col-form-label">Type</label>
                    <div className="col-sm-10">
                        <select
                            id="type"
                            value={dropDownData.type}
                            onChange={(event) => setDropDownData({
                                ...dropDownData,
                                type: event.target.value
                            })}
                            className="form-select" aria-label="Default select example"
                        >
                            <option value={'tag'} selected>Tag</option>
                            <option value={'genre'} selected>Genre</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </Card>
    )
}