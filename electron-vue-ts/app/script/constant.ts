import config from './config'

if (!config.devServerHost) config.devServerHost = 'localhost'
if (!config.devServerPort) config.devServerPort = 7080
if (!config.outputPath) config.outputPath = 'out'
if (!config.contentBase) config.contentBase = '..'

export { config }
export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export function getPath (...relative: string[]) { return require('path').join(__dirname, '..', ...relative) }
