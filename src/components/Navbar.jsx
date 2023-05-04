import { Box, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { GitHub, Person } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import Icon from "./Icon";
import "../index.css"

const Navbar = () => {
    const theme = useTheme()
    const resizeIcons = useMediaQuery(theme.breakpoints.down(600));

    return (
        <Box
            id="navbar-container"
            sx={{
                animation: "2s ease-out forwards fade-in-title, 1s ease-in-out forwards move-title;",
                animationDelay: "0s, 1.85s",
                width: "100%",
                height: "max-content",
                display: "flex", // should be flex after animation runs
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
                transform: "translate(0%, 30vh)"
            }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "center",
            }}>
                <Typography variant="h1">Lottery Scheduler</Typography>
                <Typography variant="h2">Brandon Gustrowsky</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                gap: (resizeIcons ? "5px" : "20px"),
                marginTop: "20px",
                justifyContent: "right",
            }}>
                <Icon
                    link="https://www.brandongustrowsky.com/"
                    tooltip="https://www.brandongustrowsky.com/"
                    icon={<PersonIcon sx={{
                        animation: "1.0s ease-out forwards fade-in-title",
                        animationDelay: "3.8s",
                        fontSize: (resizeIcons ? "35px" : "50px"),
                        color: theme.palette.black.main,
                        background: "rgb(201, 204, 205)",
                        borderRadius: "10px",
                        opacity: "0"
                    }} />}
                />
                <Icon
                    link="https://www.linkedin.com/in/brandon-gustrowsky/"
                    tooltip="https://www.linkedin.com/in/brandon-gustrowsky/"
                    icon={<LinkedInIcon sx={{
                        animation: "1.0s ease-out forwards fade-in-title",
                        animationDelay: "4.2s",
                        fontSize: (resizeIcons ? "35px" : "50px"),
                        color: theme.palette.blue.main,
                        opacity: "0"
                    }} />}
                />
                {/* https://github.com/BrandonGustrowsky */}
                <Icon
                    link="https://github.com/BrandonGustrowsky"
                    tooltip="https://github.com/BrandonGustrowsky"
                    icon={
                        <GitHub sx={{
                            animation: "1.0s ease-out forwards fade-in-title",
                            animationDelay: "4.6s",
                            fontSize: (resizeIcons ? "35px" : "50px"),
                            color: "rgb(46, 51, 58);",
                            opacity: "0"
                        }} />
                    }
                />
            </Box>
        </Box>
    )
}

export default Navbar