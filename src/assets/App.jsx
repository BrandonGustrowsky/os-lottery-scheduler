import './App.css'
import { Box, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import Navbar from './components/Navbar'
import Settings from './components/Settings'
import Line from './components/Line'
import Output from './components/Output'
import Queue from "./components/Queue";
import { useEffect, useRef, useState } from 'react';
import { QueueDS } from "./classes/Queue.class";
import { Process } from "./classes/Process.class";

// Use framer.com/motion/animation library for animations



function App() {

    let theme = createTheme({
        palette: {
            //off white
            primary: {
                main: "#E0E0E0"
            },
            // input borders
            secondary: {
                main: "#343941"
            },
            black: {
                main: "#1D2127"
            },
            // background
            background: {
                main: "#23272D"
            },
            // linkedin blue
            blue: {
                main: "#0CB5F9",
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
            },
            h2: {
                fontSize: "40px",
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
                fontSize: "15px",
                fontWeight: "400"
            }
        },
        breakpoints: {
            settingsMajor: 800,
        }
    })

    // Changes font sizes set in theme (above) to appropriately scale based on the viewport width
    theme = responsiveFontSizes(theme)

    // The values for the state are in this order: [ # queues, timeSlotsBeforeContextSwitch, timeSlotsBeforeReset ]
    const [queuesAndTimes, setQueuesAndTimes] = useState({
        queues: 0,
        timeBeforeContextSwitch: 0,
        timeBeforeReset: 0,
    })

    const [stats, setStats] = useState({
        processExecuting: null,
        untilContextSwitch: queuesAndTimes.timeBeforeContextSwitch,
        untilReset: queuesAndTimes.timeBeforeReset,
    })

    //The values for the state are in this order: [ process name, process length ]
    const [newProcess, setNewProcess] = useState({
        name: "",
        length: 0,
    })

    const [processes, setProcesses] = useState([])

    // const [queues, setQueues] = useState([])
    const queues = useRef([]);

    // Used to determine if the animation is currently playing
    const [isPlaying, setIsPlaying] = useState(false)

    // Saving the number of seconds total the animation has been playing
    const [time, setTime] = useState(0);


    // ONLY use this state when needing to update the queues but no other state needs to be modified
    const [update, setUpdate] = useState(false)

    let intervalId = null

    const addQueues = () => {
        for (let i = 0; i < queuesAndTimes.queues; i++) {
            queues.current[i] = new QueueDS(`Queue #${i + 1}`, [])
        }
        setUpdate(prevUpdate => !prevUpdate);
    }

    const addProcess = () => {
        const process = new Process(newProcess.name, newProcess.length, queuesAndTimes.timeBeforeContextSwitch, false)
        queues.current[0].enqueue(process)
        setProcesses([...processes, process])
    }

    const createQueueComponents = () => {
        return queues.current.map((queue, index) => {
            return <Queue
                key={index} // Required when mapping
                queueDs={queue}
                process={queues.current[index]}
                pos={index}
            />
        })
    }

    useEffect(() => {
        if (isPlaying) {
            intervalId = setInterval(() => {
                for (let i = 0; i < queues.current.length; i++) {
                    if (queues.current[i].length() > 0) {
                        let currProcess = queues.current[i].peek();
                        console.log(`PROCESS EXECUTING ==> ${stats.processExecuting}`);
                        setStats(prevStats => ({ ...prevStats, processExecuting: (currProcess ? currProcess : prevStats.processExecuting) }))
                        if (currProcess.untilContextSwitch <= 1) {
                            queues.current[i].dequeue();
                            if (currProcess.timeLeft > 0) {
                                currProcess.untilContextSwitch = queuesAndTimes.timeBeforeContextSwitch;
                                currProcess.isExecuting = false;
                                (queues.current[i + 1] ? queues.current[i + 1].enqueue(currProcess) : queues.current[i].enqueue(currProcess));
                            }
                            setStats(prevStats => ({ processExecuting: (currProcess ? currProcess : prevStats.processExecuting), untilContextSwitch: queuesAndTimes.timeBeforeContextSwitch, untilReset: prevStats.untilReset - 1 }));
                        } else {
                            if (currProcess.timeLeft <= 0) {
                                queues.current[i].dequeue();
                            } else {
                                currProcess.isExecuting = true;
                                currProcess.timeLeft--;
                                currProcess.untilContextSwitch--;
                            }
                            setStats(prevStats => ({ processExecuting: (currProcess ? currProcess : prevStats.processExecuting), untilContextSwitch: prevStats.untilContextSwitch - 1, untilReset: prevStats.untilReset - 1 }));
                        }
                        break;
                    }

                }
                setTime(prevTime => prevTime + 1);
            }, 1000)
        }
        return () => clearInterval(intervalId);
    }, [isPlaying]);

    // Used only for resetting the stats state. For some reason it can't be set inside the setInterval
    useEffect(() => {
        if (stats.untilReset === 0) {
            for (let i = 1; i < queues.current.length; i++) {
                while (queues.current[i].length() > 0) {
                    let tempProcess = queues.current[i].dequeue();
                    tempProcess.isExecuting = false;
                    tempProcess.untilContextSwitch = queuesAndTimes.timeBeforeContextSwitch;
                    queues.current[0].enqueue(tempProcess);
                }
            }
            setStats(prevStats => ({ ...stats, untilReset: queuesAndTimes.timeBeforeReset, untilContextSwitch: prevStats.untilContextSwitch - 1 }));
        }
    }, [stats.untilReset])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "50px",
                width: "100%",
            }}>
                <Navbar />
                <Settings
                    queuesAndTimes={queuesAndTimes}
                    setQueuesAndTimes={setQueuesAndTimes}
                    newProcess={newProcess}
                    setNewProcess={setNewProcess}
                    queues={queues.current}
                    addQueues={addQueues}
                    stats={stats}
                    setStats={setStats}
                    addProcess={addProcess}
                    time={time}
                />
                <Line
                    rotation="0turn"
                    width="100%"
                    height="0px"
                    color={theme.palette.secondary.main}
                />
                <Output
                    queuesAndTimes={queuesAndTimes}
                    newProcess={newProcess}
                    processes={processes}
                    createQueueComponents={createQueueComponents}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            </Box>
        </ThemeProvider>
    )
}

export default App
