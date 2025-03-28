<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'

definePageMeta({
  layout: 'tres'
})
</script>

<template>
  <TresCanvas
    clear-color="#82DBC5"
    window-size
  >
    <TresPerspectiveCamera
      :position="[10, 10, 10]"
      :look-at="[0, 0, 0]"
    />
    <TresMesh :position="[0, 0, 0]">
      <TresBoxGeometry :args="[2, 2, 2]" />
      <TresMeshStandardMaterial color="red" />
    </TresMesh>
    <TresMesh :position="[3, 0, 0]">
      <TresBoxGeometry :args="[2, 2, 2]" />
      <TresMeshStandardMaterial color="blue" />
    </TresMesh>
    <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" />
    <TresAmbientLight :intensity="0.5" />
    <OrbitControls />
  </TresCanvas>
</template>
