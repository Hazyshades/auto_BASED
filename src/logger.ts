import { Logger } from "tslog"
import { appendFileSync } from "fs"

export function makeLogger(name: string) {
    const logger = new Logger({ 
        hideLogPositionForProduction: true, 
        name: name,
        prettyLogTemplate: '{{dd}}.{{mm}} {{hh}}:{{MM}}:{{ss}}\t{{logLevelName}}\t{{name}}\t'
    })
    
    logger.attachTransport((logObj) => {
        appendFileSync("./src/logs/log.txt", JSON.stringify(logObj) + "\n")
    })

    return logger
}

export function makeResultLogger(name: string) {
    const logger = new Logger({ 
        hideLogPositionForProduction: true, 
        name: name,
        prettyLogTemplate: '{{dd}}.{{mm}} {{hh}}:{{MM}}:{{ss}}\t{{logLevelName}}\t{{name}}\t'
    })
    
    logger.attachTransport((logObj) => {
        appendFileSync("./src/logs/resultLog.txt", JSON.stringify(logObj) + "\n")
    })

    return logger
}