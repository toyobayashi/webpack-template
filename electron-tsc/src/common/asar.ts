import { join } from 'path'

(function () {
  const Module = require('module')
  const NODE_MODULES_PATH = join(__dirname, '../node_modules')
  const NODE_MODULES_ASAR_PATH = NODE_MODULES_PATH + '.asar'

  const originalResolveLookupPaths = Module._resolveLookupPaths

  Module._resolveLookupPaths = originalResolveLookupPaths.length === 2 ? (function (request: any, parent: any) {
    const result = originalResolveLookupPaths(request, parent)

    if (!result) return result

    for (let i = 0; i < result.length; i++) {
      if (result[i] === NODE_MODULES_PATH) {
        result.splice(i, 0, NODE_MODULES_ASAR_PATH)
        break
      }
    }

    return result
  }) : (function (request: any, parent: any, newReturn: any) {
    const result = originalResolveLookupPaths(request, parent, newReturn)

    const paths = newReturn ? result : result[1]
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === NODE_MODULES_PATH) {
        paths.splice(i, 0, NODE_MODULES_ASAR_PATH)
        break
      }
    }

    return result
  })
})()
