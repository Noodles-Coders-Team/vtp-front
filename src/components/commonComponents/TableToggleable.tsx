import {useState} from "react";
import iconTrue from '@assets/check_box_64.svg';
import iconFalse from '@assets/check_box_empty_64.svg';

const tableIconSize = 32;

type TableToggleableProps = {
    value: boolean;
    id: string;
    onToggle: (id: string) => void;
    size?: number;
}

export function TableToggleable({value, id, onToggle, size = tableIconSize}: TableToggleableProps) {
    const [currentValue, setCurrentValue] = useState<boolean>(value);
    return (
        <td
            onClick={(e) => {
                e.preventDefault();
                onToggle(id);
                setCurrentValue(!currentValue);
            }}
            style={{alignContent: 'center', textAlign: 'center', cursor: 'pointer'}}
        >
            <img src={currentValue ? iconTrue : iconFalse} alt="filter" width={size} height={size}/>
        </td>
    )

}
