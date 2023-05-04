import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import Process from "./Process"

const ProcessContainer = (props) => {
    const { processes } = props
    const theme = useTheme()
    const resizeContainer = useMediaQuery(theme.breakpoints.down(900))
    return (
        <Box sx={{
            display: "flex",
            width: (resizeContainer ? "100%" : "90%"),
            minHeight: "50vh",
            height: "max-content",
            background: theme.palette.background.main,
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            alignSelf: "center",
            justifyContent: (processes.length > 0 ? "none" : "center"),
            flexWrap: "wrap",
        }}>
            {processes.length > 0 ?
                processes.map((process, index) => {
                    return <Process
                        key={index}
                        process={process}
                    /> // Need to pass in the props here when appropriate
                })
                :
                <Typography
                    variant="p"
                    sx={{
                        alignSelf: "center",
                        fontSize: "20px",
                    }}
                >
                    No processes to show!
                </Typography>
            }
        </Box>
    )
}

export default ProcessContainer