import { Error } from '@mui/icons-material'

type Props = {
    msg: string
}

const ErrorDisplay = ({ msg }: Props) => {
    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <span style={{ margin: 'auto', textAlign: 'center' }}>
                <Error />
                <br />
                {msg}
            </span>
        </div>
    )
}

export default ErrorDisplay
