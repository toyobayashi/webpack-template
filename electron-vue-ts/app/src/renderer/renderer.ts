import '@/style/style.css'

async function main () {
  const { default: Vue } = (await import(/* webpackChunkName: "vue" */ 'vue'))
  const { default: App } = (await import(/* webpackChunkName: "App" */ '@/App.vue'))

  const vm = new Vue({
    render: h => h(App)
  })

  vm.$mount('#root')
}

main().catch(err => console.log(err))

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
