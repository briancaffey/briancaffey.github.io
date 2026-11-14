<template>
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask :id="maskId">
      <rect
        x="0.5"
        y="2.5"
        width="23"
        height="19"
        rx="4"
        fill="#fff"
      />
      <text
        x="12"
        y="15.3"
        text-anchor="middle"
        font-family="Montserrat, Helvetica, Arial, sans-serif"
        font-size="8.4"
        font-weight="800"
        letter-spacing="-0.2"
        fill="#000"
      >DEV</text>
    </mask>
    <rect
      x="0.5"
      y="2.5"
      width="23"
      height="19"
      rx="4"
      fill="currentColor"
      :mask="`url(#${maskId})`"
    />
  </svg>
</template>

<script setup lang="ts">
// Unique per instance so several icons on a page do not share a mask id.
const maskId = `devto-mask-${useId()}`
</script>
