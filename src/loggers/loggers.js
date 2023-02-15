import pino from "pino";

const logger = pino({
        level: 'info'
    })

const logInfo = (msg) => {
        logger.info({message: msg})
}

const logWarn = (msg) => {
    logger.warn(msg)
 }


const logError = (msg) => {
    logger.error(msg)
}


const logDebug = (msg) => {
        logger.debug(msg)
}

export const Loggers = {
    logDebug, logInfo, logWarn , logError
  };
  








