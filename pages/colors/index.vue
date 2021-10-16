<template>
  <div class="mx-auto max-w-6xl flex">
    <div class="palette box-color" /> color
    <div class="palette box-color-primary" /> color-primary
    <div class="palette box-color-secondary" /> color-secondary
    <div class="palette box-color-primary" /> color-primary
    <div class="palette box-bg" /> color-bg
    <div class="palette box-bg-secondary" /> color-bg-secondary
    <div class="palette box-bg-code" /> color-bg-code
    <div class="palette box-border-color" /> color-border-color
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.palette {
  border-color: white;
  border-width: 10px;
}
.box-color {
  height: 100px;
  width: 100px;
  background-color: var(--color);
}

.box-color-primary {
  height: 100px;
  width: 100px;
  background-color: var(--color-primary);
}

.box-color-secondary {
  height: 100px;
  width: 100px;
  background-color: var(--color-secondary);
}

.box-bg {
  height: 100px;
  width: 100px;
  background-color: var(--color-bg);
}

.box-bg-secondary {
  height: 100px;
  width: 100px;
  background-color: var(--bg-secondary);
}

.box-bg-code {
  height: 100px;
  width: 100px;
  background-color: var(--bg-code);
}

.box-border-color {
  height: 100px;
  width: 100px;
  background-color: var(--border-color);
}

  /* --color: #243746;
  --color-primary: #158876;
  --color-secondary: #0e2233;
  --bg: #f3f5f4;
  --bg-secondary: #fff;
  --bg-code: #ddd;
  --border-color: #ddd; */
</style>
