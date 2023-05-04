import { Box, Button, Divider, IconButton, Input, InputLabel, Typography, useMediaQuery, useTheme } from "@mui/material"
import LaunchIcon from '@mui/icons-material/Launch';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { useEffect, useRef } from "react";
import { Process } from "../backend/Process";
import { useSnackbar } from "notistack";

const Settings = (props) => {
    const { totalTickets, setTotalTickets, setProcesses, stats, setStats, newProcess, setNewProcess, setTimeQuantum, timeLeft, setTimeLeft } = props
    const theme = useTheme()
    const resizeInputContainers = useMediaQuery(theme.breakpoints.down(900));
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    let tempTotalNumberTickets = useRef(0)

    const snackbarMessage = "Exceeding the max number of tickets available!";

    useEffect(() => {
    }, [newProcess.ticketMax]) // newProcess.ticketMin would work also

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                height: "max-content",
            }}>
            <Box sx={{
                display: "flex",
                flexDirection: (resizeInputContainers ? "column" : "row"),
                justifyContent: "space-between",
                gap: (resizeInputContainers ? "30px" : "0"),
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Process Name</Typography>
                        <Input
                            placeholder="Process Name"
                            disableUnderline={true}
                            value={newProcess.name}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                            onChange={(event) => { setNewProcess(prevNewProcess => ({ ...prevNewProcess, name: event.target.value })) }}
                        />
                    </InputLabel>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Process Length</Typography>
                        <Input
                            placeholder="Process Length"
                            disableUnderline={true}
                            value={newProcess.length}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                            onChange={(event) => { setNewProcess(prevNewProcess => ({ ...prevNewProcess, length: Number(event.target.value) })) }}
                        />
                    </InputLabel>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p"># Tickets</Typography>
                        <Input
                            placeholder="# Tickets"
                            disableUnderline={true}
                            value={ (newProcess.ticketMax === 0 && newProcess.ticketMin === 0) ? 0 : newProcess.ticketMax - newProcess.ticketMin + 1 }
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                            // onChange={ (event) => { tempProcessNumberTickets.current = Number(event.target.value) } }
                            onChange={(event) => {
                                setNewProcess(prevNewProcess => ({ ...prevNewProcess, ticketMin: Number(stats.nextAvailableTicket), ticketMax: Number(stats.nextAvailableTicket) + Number(event.target.value) - 1 }))
                            }}
                        />
                    </InputLabel>
                    <Button
                        variant="contained"
                        endIcon={<LaunchIcon />}
                        sx={{
                            background: theme.palette.blue.main,
                            border: `1px solid ${theme.palette.secondary.main}`
                        }}
                        onClick={() => {
                            if (Number(newProcess.ticketMax) > totalTickets) {
                                enqueueSnackbar(snackbarMessage);
                            } else if (Number(newProcess.ticketMax === 0)) {
                                enqueueSnackbar("Cannot create a process with zero tickets!");
                            } else {
                                console.log(Number(newProcess.ticketMax));
                                const processObj = new Process(newProcess.name, newProcess.length, Number(newProcess.ticketMin), Number(newProcess.ticketMax))
                                // setStats(prevStats => ({ ...prevStats, nextAvailableTicket: processObj.ticketMax + 1 }))
                                setProcesses(prevProcesses => ([...prevProcesses, processObj]));
                                setNewProcess({
                                    name: "",
                                    length: 0,
                                    ticketMin: 0,
                                    ticketMax: 0,
                                })
                                enqueueSnackbar(`${processObj.name} has been created`);
                            }
                        }}
                    >
                        Create Process
                    </Button>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Time Quantum</Typography>
                        <Input
                            placeholder="Time Quantum"
                            disableUnderline={true}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                            onChange={(event) => {
                                setTimeQuantum(Number(event.target.value));
                                setTimeLeft(Number(event.target.value));
                            }}
                        />
                    </InputLabel>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Total # Tickets</Typography>
                        <Input
                            placeholder="Total # Tickets"
                            disableUnderline={true}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                            onChange={(event) => tempTotalNumberTickets.current = Number(event.target.value)}
                        />
                    </InputLabel>
                    <Button
                        variant="contained"
                        endIcon={<BookOnlineIcon />}
                        sx={{
                            background: theme.palette.blue.main,
                            border: `1px solid ${theme.palette.secondary.main}`
                        }}
                        onClick={() => {
                            const totalAmt = Number(tempTotalNumberTickets.current);
                            if (totalAmt && totalAmt > 0) {
                                setTotalTickets(totalAmt);
                                enqueueSnackbar("Total tickets successfully set!")
                            } else {
                                enqueueSnackbar(`'${totalAmt}' is not a valid value!`);
                            }
                        }}
                    >
                        Set Ticket Count
                    </Button>
                </Box>
            </Box>
            <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                    borderWidth: "1px",
                    borderColor: "rgb(110,110,110)",
                }}
            />
            <Box sx={{
                display: "flex",
                flexDirection: (resizeInputContainers ? "column" : "row"),
                justifyContent: "space-around",
                gap: (resizeInputContainers ? "0" : "10px")
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Current Process Executing</Typography>
                        <Input
                            placeholder="None"
                            disableUnderline={true}
                            value={stats.currentProcess?.name}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                        />
                    </InputLabel>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Ticket Selected</Typography>
                        <Input
                            placeholder="None"
                            disableUnderline={true}
                            value={stats.currentTicket}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                        />
                    </InputLabel>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Total # Tickets</Typography>
                        <Input
                            value={`${totalTickets}`}
                            disableUnderline={true}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                        />
                    </InputLabel>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}>
                    <InputLabel sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "4px"
                    }}>
                        <Typography variant="p">Time Quantum Left</Typography>
                        <Input
                            value={`${timeLeft}`}
                            disableUnderline={true}
                            sx={{
                                width: "170px",
                                height: "45px",
                                padding: "0 10px",
                                background: theme.palette.primary.main,
                                borderRadius: "4px",
                                fontSize: "16px",
                                border: "1.5px solid rgb(64, 70, 78)",
                            }}
                        />
                    </InputLabel>
                </Box>
            </Box>
        </Box>
    )
}

export default Settings