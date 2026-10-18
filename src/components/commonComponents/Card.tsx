import type {ReactNode} from 'react';
import {Container} from "@commonComponents/Container.tsx";


interface CardProps {
    children: ReactNode,
    title: string
}


export default function Card({children, title}: CardProps) {
    return (
        <div className='card' style={{margin: 20}}>
            <div className="card-header">
                {title}
            </div>
            <div className='card-body'>
                <Container>
                    {children}
                </Container>
            </div>
        </div>)
}