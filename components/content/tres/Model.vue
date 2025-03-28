<script setup>
import { GLTFModel } from '@tresjs/cientos'
</script>

<template>
  <div class="tres-container">
    <TresCanvas>
      <TresPerspectiveCamera :position="[5, 5, 5]" />
      <OrbitControls />
      <Suspense>
        <GLTFModel path="/static/tresjs/model.glb" />
      </Suspense>
      <TresDirectionalLight :position="[-4, 8, 4]" :intensity="10.5" cast-shadow />
    </TresCanvas>
  </div>
</template>

<style>
.tres-container {
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: block;
}
</style>
