import { Box, Fade, Tooltip, Typography, Zoom } from "@mui/material"

const Process = (props) => {
    const { process } = props
    return (
        <Tooltip
            placement="top"
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 200 }}
            followCursor
            arrow
            title={
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <Typography variant="p">Process Name: {process?.name}</Typography>
                    <Typography variant="p">Tickets: {process?.ticketMin} - {process?.ticketMax} ({process?.ticketMax - process?.ticketMin + 1} total)</Typography>
                    <Typography variant="p">Process Length: {process?.length}</Typography>
                    <Typography variant="p">{process?.isExecuting ? "Is" : " Not "} currently executing</Typography>
                    <Typography variant="p">{process?.timeLeft} ticks left</Typography>
                </Box>
            }>
            <Box sx={{
                background: `rgb(${process?.color.red}, ${process?.color.green}, ${process?.color.blue})`,
                width: "14.29%%",
                minWidth: "100px",
                height: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                padding: "0 10px",
                alignItems: "center",
                justifyContent: "center",
                outline: `${process?.isExecuting ? "2px" : "0px"} solid black`,
                position: "relative",
                zIndex: `${process?.isExecuting ? "10" : "0"}`
            }}>
                <Typography variant="p">{process?.name}</Typography>
                <Typography variant="p">{process?.isExecuting ? "Is" : " Not "} currently executing</Typography>
                <Typography variant="p">Tickets: {process?.ticketMin} - {process?.ticketMax} ({process?.ticketMax - process?.ticketMin + 1} total)</Typography>
                <Typography variant="p">{process?.timeLeft} ticks left</Typography>
            </Box>
        </Tooltip>
    )
}

export default Process