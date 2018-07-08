<template>
<div class="root" id="root">
  <p>{{text}}</p>
  <button @click="text = text + '!!!'">click</button>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  text: string = 'Vue Typescript'
}

(async function () {
  const ms = await (ms => new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  }))(1000)
  console.log(ms)
})()
</script>

<style scoped>
.root {
  background: #eee;
  color: #000;
}
</style>
