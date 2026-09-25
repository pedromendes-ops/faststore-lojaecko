export type PitBarItem = {
    image: string
    imageMobile?: string
    alt?: string
    line1?: string
}

export type PitBarProps = {
    config?: {
        label?: string
        grid?: 'container' | 'full'
        marginTop?: number    
        background?: string
    }    
    items?: PitBarItem[]
}