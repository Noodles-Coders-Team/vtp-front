import {type ReactNode, useEffect, useState} from "react";
import {eventBus} from "@api/EventBus.ts";
import iconDesc from '@assets/arrow_upward_64.svg';
import iconAsc from '@assets/arrow_downward_64.svg';
import iconFilterOff from '@assets/filter_off_64.svg';
import {EventName} from "@api/EventBus";


const tableIconSize = 32;


type TableColumnNameProps = {
    children: ReactNode;
    state?: number;
    id: string;
    onChangeState: (id: string, newState: number) => void;
    size?: number;
    style?: React.CSSProperties | undefined;
}


export function TableTextColumnName({
                                        state = 0,
                                        id,
                                        children,
                                        onChangeState,
                                        size = tableIconSize,
                                        style
                                    }: TableColumnNameProps) {
    const [currentState, setCurrentState] = useState<number>(state);


    const resetSorting = () => {
        setCurrentState(0);
    };


    useEffect(() => {
        eventBus.addEventListener(EventName.SortingReset, resetSorting);
        return () => {
            eventBus.removeEventListener(EventName.SortingReset, resetSorting);
        };
    }, []);


    const toggleState = () => {
        let state: number = 0;
        if (currentState == 0)
            state = 1;
        else if (currentState == 1)
            state = -1;
        else if (currentState == -1)
            state = 0;
        eventBus.dispatchEvent(new Event(EventName.SortingReset));
        setCurrentState(state);
        onChangeState(id, state);
    };

    return (
        <td
            onClick={async (e) => {
                e.preventDefault();
                toggleState();
            }}
            style={{alignContent: 'center', textAlign: 'center', cursor: 'pointer', ...style}}
        >
            {currentState == 0 &&
                <img src={iconFilterOff} alt="Sortign Off" width={size} height={size}/>
            }
            {currentState == 1 &&
                <img src={iconAsc} alt="ASC" width={size} height={size}/>
            }
            {currentState == -1 &&
                <img src={iconDesc} alt="DESC" width={size} height={size}/>
            }
            <p>{children}</p>
        </td>
    )
}