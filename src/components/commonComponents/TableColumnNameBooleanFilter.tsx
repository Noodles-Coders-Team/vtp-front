import iconNone from '@assets/filter_off_64.svg';
import iconTrue from '@assets/check_box_64.svg';
import iconFalse from '@assets/check_box_empty_64.svg';

const iconSize = 32;

type TableColumnProps = {
    label: string;
    value: boolean | null;
    onChange: (value: boolean | null) => void;
}

export function TableColumnNameBooleanFilter({ label, value, onChange }: TableColumnProps) {

    const switchBoolean = () => {
        if (value === null)
            onChange(true);
        else if (value)
            onChange(false);
        else
            onChange(null);
    }

    function getIcon() {
        if (value)
            return iconTrue;
        else if (value === false)
            return iconFalse;
        else
            return iconNone;
    }

    return (
        <th scope="col" onClick={switchBoolean} style={{alignContent: 'center', textAlign: 'center'}}>
            <div className="container text-center">
                <div className="row">
                    <div className='col'>
                        {label}
                    </div>
                    <div className='col'>
                        <img src={getIcon()} alt="filter" width={iconSize} height={iconSize} />
                    </div>
                </div>
            </div>
        </th>
    )
}