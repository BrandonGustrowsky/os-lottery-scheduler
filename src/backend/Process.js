
export class Process {
    constructor(name, length, ticketMin, ticketMax) {
        this.name = name
        this.length = length
        this.timeLeft = length
        this.ticketMin = ticketMin
        this.ticketMax = ticketMax
        this.isExecuting = false
        // this.timeUntilQuantumReset = 
        this.color = {
            red: this.generateRGB(),
            green: this.generateRGB(),
            blue: this.generateRGB()
        }
    }

    /**
     * 
     * @returns A psuedo randomly generated number between 128 and 255 inclusive
     */
    generateRGB() {
        return Math.floor(Math.random() * 128) + 128;
    }

    /**
     * 
     * @param {Number} ticket The numerical value of a ticket 
     * @returns A boolean determining if the process holds the ticket passed as the argument
     */
    isTicketValid(ticket) {
        return (this.ticketMin <= ticket) && (ticket <= this.ticketMax);
    }

    /**
     * 
     * @returns A boolean indicating if the process has completed execution
     */
    isFinished() {
        return this.timeLeft <= 1;
    }


}