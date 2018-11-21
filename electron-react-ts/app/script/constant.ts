export const config = require('./config.json')

if (!config.devServerHost) config.devServerHost = 'localhost'
if (!config.devServerPort) config.devServerPort = 6080
if (!config.outputPath) config.outputPath = 'public'
if (!config.contentBase) config.contentBase = '..'

export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export function getPath (...relative: string[]) { return require('path').join(__dirname, '..', ...relative) }
