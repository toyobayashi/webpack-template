<template>
<div class="root" id="root">
  <h1 class="title">Vue TypeScript</h1>
  <div>Vue: {{version}}</div>
  <div class="content" @click="test">Component State: {{count}}</div>
</div>
</template>

<script lang="ts" src="./app.ts">
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  color: rgb(79, 192, 141);
  font-weight: bold;
  margin-bottom: 20px;
}
.content {
  cursor: pointer;
}
</style>
