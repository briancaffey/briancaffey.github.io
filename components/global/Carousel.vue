<template>
  <div class="image-carousel">
    <div class="carousel-container">
      <img :src="`/img/three-body-problem/invokeai/${dir}/${currentIndex}.png`" alt="Carousel Image" class="carousel-image">
    </div>
    <div class="button-container text-center p-4 text-black rounded">
      <button class="p-2 bg-green-100 rounded" :disabled="currentIndex == 1" @click="prevImage">
        Previous
      </button>
      <button class="p-2 bg-green-100 rounded" :disabled="currentIndex == count" @click="nextImage">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dir: {
      type: String,
      default: () => ''
    },
    count: {
      type: Number,
      default: () => 1
    }
  },
  data () {
    return {
      currentIndex: 1
    }
  },
  methods: {
    prevImage () {
      if (this.currentIndex > 1) {
        this.currentIndex--
      }
    },
    nextImage () {
      if (this.currentIndex < this.count) {
        this.currentIndex++
      }
    }
  }
}
</script>
