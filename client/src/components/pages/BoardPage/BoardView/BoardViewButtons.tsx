import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

type Props = {
    current: BoardViewTab
    onClick: (tabId: BoardViewTab) => void
}

export type BoardViewTab = 'Tasks' | 'Collaborators' | 'Archives' | 'Settings'

const BoardViewButtons = ({ current, onClick }: Props) => {
    const buttons = [
        { id: 'Tasks', label: 'Tasks', value: 'Tasks' },
        { id: 'Collaborators', label: 'Collaborators', value: 'Collaborators' },
        { id: 'Archives', label: 'Archives', value: 'Archives' },
        { id: 'Settings', label: 'Settings', value: 'Settings' },
] satisfies { id: BoardViewTab, label: string, value: BoardViewTab }[]

    return (
        <div>
            <ToggleButtonGroup>
                {
                    buttons.map(button => (
                        <ToggleButton
                            key={button.id}
                            value={button.value}
                            selected={button.value === current}
                            onClick={() => onClick(button.value)}
                        >
                            <Typography variant="body2">{button.label}</Typography>
                        </ToggleButton>
                    ))
                }
            </ToggleButtonGroup>
        </div>
    )
}

export default BoardViewButtons
