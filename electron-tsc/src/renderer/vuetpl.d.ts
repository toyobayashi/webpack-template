declare module '*.html' {
  import { CompiledResultFunctions } from 'vue-template-compiler'
  const template: CompiledResultFunctions
  export default template
}
