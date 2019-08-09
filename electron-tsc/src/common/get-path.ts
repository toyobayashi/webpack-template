import { join } from 'path'

export function getPath (...relative: string[]) {
  return join(__dirname, '../..', ...relative)
}
