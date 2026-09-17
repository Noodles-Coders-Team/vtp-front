import type {ReactNode} from 'react';

interface CardProps {
    children: ReactNode,
    title: string
}

export default function Card({children, title}: CardProps) {
    return (
        <div className='card' style={{margin: 20}}>
            <div className='card-body'>
                <h5 className='card-title'>{title}</h5>
                {children}
            </div>
        </div>)
}