import { join } from 'path'

export function getPath (...relative: string[]): string {
  return join(__dirname, '..', ...relative)
}
