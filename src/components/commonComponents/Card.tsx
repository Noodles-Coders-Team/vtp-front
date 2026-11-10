import type {ReactNode} from 'react';
import {Container} from "@commonComponents/Container.tsx";


interface CardProps {
    children: ReactNode,
    title: string,
    style?: React.CSSProperties | undefined
}


export default function Card({children, title, style = {}}: CardProps) {
    return (
        <div className='card' style={{margin: '0 auto', width: '95%', ...style}}>
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