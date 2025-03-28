<script setup>
import { ref } from 'vue'
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import * as THREE from 'three'
import { useFullscreen } from '@vueuse/core'
// import { OrbitControls, Environment } from '@tresjs/cientos'

const rotationSpeed = ref(0.01)
const boxRef = ref(null)
const containerRef = ref(null)
const rotationQuaternion = new THREE.Quaternion()
const tempQuaternion = new THREE.Quaternion()

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef)

const { onLoop } = useRenderLoop()

onLoop(() => {
  if (boxRef.value) {
    // Create rotation quaternions for Y and Z axes
    tempQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed.value)
    rotationQuaternion.multiply(tempQuaternion)

    tempQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotationSpeed.value * 3.7)
    rotationQuaternion.multiply(tempQuaternion)

    // Apply the quaternion rotation
    boxRef.value.quaternion.copy(rotationQuaternion)
  }
})
</script>

<template>
  <div ref="containerRef" style="width: 100%; height: 400px; margin: 2rem 0; border-radius: 8px; overflow: hidden; position: relative;">
    <button style="position: absolute; top: 16px; right: 16px; z-index: 100; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 8px; cursor: pointer; color: white; backdrop-filter: blur(4px);" @click="toggleFullscreen">
      <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
      </svg>
    </button>
    <TresCanvas
      alpha
      :window-size="false"
      :dpr="[1, 2]"
      :power-preference="'high-performance'"
      :render-mode="'always'"
      :camera="{ position: [0, 0, 5], fov: 75 }"
    >
      <TresScene>
        <!-- Add a rotating cube -->
        <TresMesh ref="boxRef">
          <TresBoxGeometry :args="[1, 1, 1]" />
          <TresMeshStandardMaterial color="#1f6b6b" />
        </TresMesh>

        <!-- Add lighting -->
        <TresAmbientLight :intensity="0.5" />
        <TresDirectionalLight :position="[10, 10, 5]" :intensity="1" />

        <!-- Add environment for better lighting -->
        <Environment preset="city" />

        <!-- Add orbit controls for interaction -->
        <OrbitControls :enable-damping="true" />
      </TresScene>
    </TresCanvas>
  </div>
</template>

<style scoped>
.tres-container {
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
}
</style>
