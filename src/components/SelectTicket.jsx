import { Layers } from '@mui/icons-material';
import { Button, useTheme } from '@mui/material';

const SelectTicket = (props) => {
    const { drawRandomTicketAndSetExecutingProcess } = props
    const theme = useTheme();
    return (
        <Button
            variant="outlined"
            endIcon={<Layers />}
            sx={{
                color: theme.palette.black.main,
                width: "30%",
                alignSelf: "center",
                border: `1px solid ${theme.palette.blue.main}`,
            }}
            onClick={ () => { drawRandomTicketAndSetExecutingProcess() }}
        >
            Draw Ticket
        </Button>
    )
}

export default SelectTicket