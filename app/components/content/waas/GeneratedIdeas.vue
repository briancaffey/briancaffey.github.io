<template>
  <div>
    <div class="flex-1 text-center">
      <button
        :disabled="ideaIndex === 0"
        @click="decrementIdeasIndex"
      >
        Previous Idea
      </button>
      <div>Idea #{{ ideaIndex + 1 }}</div>
      <button @click="incrementIdeasIndex">
        Next Idea
      </button>
    </div>

    <br>
    <div class="text-center">
      <div class="p-3 rounded border border-white hero">
        {{ currentIdea }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useWaasStore } from '@/stores/waas'; // Import the Pinia store

const store = useWaasStore();

// Fetch generated ideas when the component is mounted
onMounted(() => {
  store.fetchGeneratedIdeas();
});

// Computed properties for accessing the store's state
const ideaIndex = computed(() => store.getIdeaIndex);
const currentIdea = computed(() =>
  store.getGeneratedIdeas(ideaIndex.value)
);

// Methods to increment and decrement the idea index
function incrementIdeasIndex() {
  store.changeIdeasIndex(1);
}

function decrementIdeasIndex() {
  store.changeIdeasIndex(-1);
}
</script>

<style scoped></style>
