import type { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode,
    style?: React.CSSProperties | undefined
}

export function Container({ children, style = undefined }: ContainerProps) {
    return (
        <div className="container text-center" style={style}>
            {children}
        </div>
    )
}


export function Row({ children, style = {} }: ContainerProps) {
    return (
        <div className="row" style={style}>
            {children}
        </div>
    )
}


export function Column({ children, style = {} }: ContainerProps) {
    return (
        <div className="col" style={style}>
            {children}
        </div>
    )
}