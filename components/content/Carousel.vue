<template>
  <client-only>
    <div class="image-carousel">
      <div class="carousel-container">
        <img :src="`/static/three-body-problem/invokeai/${dir}/${currentIndex}.png`" alt="Carousel Image" class="carousel-image">
      </div>
      <div class="button-container text-center p-4 text-black rounded">
        <button class="p-2 bg-green-100 rounded" :disabled="currentIndex.value == 1" @click="prevImage">
          Previous
        </button>
        <button class="p-2 bg-green-100 rounded" :disabled="currentIndex.value == count" @click="nextImage(count)">
          Next
        </button>
      </div>
    </div>
  </client-only>
</template>

<script setup>
defineProps({
  dir: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 1
  }
});

const currentIndex = ref(1);

const prevImage = () => {
  if (currentIndex.value > 1) {
    currentIndex.value--;
  }
};

const nextImage = (count) => {
  if (currentIndex.value < count) {
    currentIndex.value++;
  }
};
</script>
