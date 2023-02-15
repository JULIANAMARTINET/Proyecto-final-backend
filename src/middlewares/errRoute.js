import {Loggers} from "../loggers/loggers.js"

const errRoutes = async (req, res, next) => {
    try {
        Loggers.logWarn('Ruta inexistente')
        res.redirect('/')
        next()
    } catch (error) {
        Loggers.logError(`error with route: ` + error)
    }
}

export const NoRoute = { errRoutes }
