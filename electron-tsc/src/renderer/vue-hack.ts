
import * as compiler from 'vue-template-compiler'
import * as fs from 'fs'
// import * as path from 'path'
// import { VueConstructor } from 'vue'

// const Vue: VueConstructor  = require('vue')

const Module = require('module')

// Module._extensions['.vue'] = Module._extensions['.vue'] || function(module: NodeJS.Module, filename: string) {
//   const content = fs.readFileSync(filename, 'utf8')
//   const desc = compiler.parseComponent(content)
//   const template = desc.template ? desc.template.content : '<div></div>'
//   const script = desc.script ? (desc.script.src ? fs.readFileSync(path.join(path.dirname(filename), desc.script.src), 'utf8') : desc.script.content) : 'module.exports = {}'

//   const { render, staticRenderFns } = compiler.compileToFunctions(template);

//   (module as any)._compile(script, filename)
//   console.log(module)
//   module.exports.render = render
//   module.exports.staticRenderFns = staticRenderFns

//   module.exports = Vue.extend(module.exports)
// }
Module._extensions['.html'] = Module._extensions['.html'] || function(module: NodeJS.Module, filename: string) {
  module.exports.default = compiler.compileToFunctions(fs.readFileSync(filename, 'utf8'))
}
