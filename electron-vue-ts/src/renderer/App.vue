<template>
<div class="root" id="root">
  <img :src="'../../static.asar/128x128.png'" />
  <h1 class="title">Electron Vue TypeScript</h1>
  <div>Vue: {{version}}</div>
  <div>Electron: {{electronVersion}}</div>
  <div class="content" @click="test">Component State: {{count}}</div>
</div>
</template>

<script lang="ts" src="./app.ts">
</script>

<style lang="stylus" scoped>
.root
  width 100%
  height 100%
  position absolute
  display flex
  flex-direction column
  justify-content center
  align-items center

.title
  color rgb(79, 192, 141)
  font-weight bold
  margin-bottom 20px

.content
  cursor pointer
</style>
