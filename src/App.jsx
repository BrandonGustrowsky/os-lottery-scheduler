import './App.css'
import { Box, Button, Divider, Slider, ThemeProvider, Typography, createTheme, responsiveFontSizes, useMediaQuery, useTheme } from '@mui/material'
import Navbar from './components/Navbar'
import Settings from './components/Settings'
import SelectTicket from './components/SelectTicket'
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ProcessContainer from './components/ProcessContainer'
import { useEffect, useRef, useState } from 'react';
import { SnackbarProvider } from 'notistack';

// Use framer.com/motion/animation library for animations

function App() {

    let theme = createTheme({
        palette: {
            //off white
            primary: {
                main: "#EEEEEE"
            },
            // input borders
            secondary: {
                main: "rgba(68, 70, 73, 0.6)"
            },
            black: {
                main: "#1D2127"
            },
            // mid text color
            midWhite: {
                main: "#4A4A4A"
            },
            // background
            background: {
                main: "rgb(252, 250, 251)"
            },
            // linkedin blue
            blue: {
                main: "#0CB5F9"
            },
            //yellow
            yellow: {
                main: "#FEFF5A"
            }
        }
    })

    theme = createTheme(theme, {
        typography: {
            h1: {
                fontSize: "80px",
                fontWeight: "400",
                color: theme.palette.midWhite.main
            },
            h2: {
                fontSize: "40px",
                color: theme.palette.midWhite.main
            },
            h3: {
                fontSize: "30px",
                color: theme.palette.primary.main,
            },
            h6: {
                fontSize: "20px",
                color: theme.palette.primary.main,
            },
            processTitle: {
                fontSize: "15px",
            },
            p: {
                fontSize: "16px",
                fontWeight: "400"
            }
        },
        breakpoints: {
            settingsMajor: 800,
        }
    })

    // Changes font sizes set in theme (above) to appropriately scale based on the viewport width
    theme = responsiveFontSizes(theme)

    // All processes as a data structure, NOT as a component
    const [processes, setProcesses] = useState([])

    // Total number of tickets available on the "CPU"
    const [totalTickets, setTotalTickets] = useState(0)

    // Constant time for a single process to execute on the CPU before a new ticket is selected
    const [timeQuantum, setTimeQuantum] = useState(0);

    // Time left before a time quantum runs out (actively counting down and being reset)
    const [timeLeft, setTimeLeft] = useState(0);

    // Determines if the "CPU" plays or not
    const [isPlaying, setIsPlaying] = useState(false);

    // Checks if the visualization is at it's start
    const [isStart, setIsStart] = useState(true);

    // Data on what is currently executing
    const [stats, setStats] = useState({
        currentProcess: "None",
        currentTicket: "None",
        nextAvailableTicket: 0
    })

    // Playback speed value
    const [playbackSpeed, setPlaybackSpeed] = useState(1000);

    // State for the new process being created in the form
    let [newProcess, setNewProcess] = useState({
        name: "",
        length: 0,
        ticketMin: 0,
        ticketMax: 0,
    })

    // For determining how many tickets a deleted process had
    const [deletedTickets, setDeletedTickets] = useState({
        count: 0,
        index: -1
    });

    const drawRandomTicketAndSetExecutingProcess = () => {
        const ticket = Number(Math.floor(Math.random() * stats.nextAvailableTicket));
        for (let process of processes) {
            if (process.isTicketValid(Number(ticket))) {
                process.isExecuting = true;
                setStats(prevStats => ({ ...prevStats, currentProcess: process, currentTicket: ticket }));
            } else {
                process.isExecuting = false;
                setStats(prevStats => ({ ...prevStats }))
            }
        }
    }

    useEffect(() => {
        if (processes.length > 0) {
            const process = processes[processes.length - 1];
            setStats(prevStats => ({...prevStats, nextAvailableTicket: process.ticketMax + 1}));
            console.log("setting stats to more");
        } else {
            console.log("setting stats to 0");
            setStats(prevStats => ({...prevStats, nextAvailableTicket: 0}));
        }
    }, [processes])

    useEffect(() => {
        if (isPlaying) {
            const intervalId = setInterval(() => {
                if (timeLeft >= 1) {
                    for (let process of processes) {
                        if (process.isExecuting) {
                            if (process.isFinished()) {
                                const index = processes.indexOf(process);
                                let count = process.ticketMax - process.ticketMin + 1;
                                setProcesses(prevProcesses => {
                                    const newProcesses = prevProcesses.filter(
                                        filterProcess => !filterProcess.isFinished()
                                    )
                                    return newProcesses.map(newProcess => {
                                        const newProcessIndex = newProcesses.indexOf(newProcess);
                                        if (newProcessIndex >= index) {                                            
                                            const previousProcess = newProcesses[newProcessIndex-1];
                                            if ((newProcess.ticketMin - count >= 0 && newProcessIndex === 0) || (newProcessIndex > 0 && newProcess.ticketMin - count > previousProcess.ticketMax)) {
                                                newProcess.ticketMin -= count;
                                                newProcess.ticketMax -= count;
                                            }
                                        }
                                        return newProcess

                                    })
                                })
                                setIsPlaying(false);
                                setIsPlaying(true);
                                // break;
                            }
                            process.timeLeft--;
                            break;
                        }
                    }
                    setTimeLeft(prevTimeLeft => { return prevTimeLeft - 1 });
                }
            }, playbackSpeed)
            return () => clearInterval(intervalId);
        }
    }, [isPlaying, playbackSpeed])

    useEffect(() => {
        if (isPlaying) {
            if (timeLeft < 1) {
                drawRandomTicketAndSetExecutingProcess();
                setTimeLeft(timeQuantum);
            }
        }
    })

    return (
        <SnackbarProvider maxSnack={2}>
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}>
                    <Navbar />
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        opacity: 0,
                        animation: "0.8s ease-out forwards fade-in-title",
                        animationDelay: "5.8s"
                    }}>
                        <Settings
                            totalTickets={totalTickets}
                            setTotalTickets={setTotalTickets}
                            setProcesses={setProcesses}
                            stats={stats}
                            setStats={setStats}
                            newProcess={newProcess}
                            setNewProcess={setNewProcess}
                            setTimeQuantum={setTimeQuantum}
                            timeLeft={timeLeft}
                            setTimeLeft={setTimeLeft}
                        />
                        <Divider variant="fullWidth" />
                        {/* <SelectTicket
                            drawRandomTicketAndSetExecutingProcess={drawRandomTicketAndSetExecutingProcess}
                        /> */}
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}>
                            <Button
                                startIcon={isPlaying ? <PauseCircleIcon /> : <PlayCircleFilledOutlinedIcon />}
                                variant="contained"
                                sx={{
                                    background: theme.palette.blue.main,
                                    width: "fit-content",
                                    alignSelf: "center"
                                }}
                                onClick={() => {
                                    if (timeLeft < 1 || isStart) {
                                        drawRandomTicketAndSetExecutingProcess()
                                        isStart ? setIsStart(false) : null;
                                    }
                                    setIsPlaying(prevIsPlaying => !prevIsPlaying)
                                }}
                            >
                                {isPlaying ? "Pause" : "Play"}
                            </Button>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                            }}>
                                <Typography variant="p">Adjust Playback Speed</Typography>
                                <Slider
                                    size="small"
                                    defaultValue="1"
                                    step={0.25}
                                    min={0.25}
                                    max={2}
                                    marks={[
                                        { value: 0.25, label: "0.25" },
                                        { value: 0.5, label: "0.5" },
                                        { value: 0.75, label: "0.75" },
                                        { value: 1, label: "1" },
                                        { value: 1.25, label: "1.25" },
                                        { value: 1.5, label: "1.5" },
                                        { value: 1.75, label: "1.75" },
                                        { value: 2, label: "2" },
                                    ]}
                                    sx={{
                                        color: theme.palette.secondary.main,
                                        width: "400px"
                                    }}
                                    onChange={(event, newValue) => { //setPlaybackSpeed(newValue) 
                                        setPlaybackSpeed(1000 * (2 - newValue));
                                    }}
                                />
                            </Box>
                        </Box>
                        <ProcessContainer
                            processes={processes}
                        />
                    </Box>
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    )
}

export default App
