<template>
  <div class="mx-auto text-center">
    <nuxt-link
      :to="prevLink"
      :class="`
        px-2
        py-2
        text-xl
        text-white
        shadow
        rounded-lg
        mx-1
        mt-1
        uppercase
        cursor-pointer
        ${pageNo == 1 ? 'pagination-disabled' : 'pagination'}
        `"
    >
      &nbsp;←
    </nuxt-link>&nbsp;

    <nuxt-link
      :to="`/blog/${pageNo}`"
      class="
        px-2
        py-2
        text-lg
        text-xl
        text-white
        shadow
        rounded-lg
        mx-1
        mt-1
        uppercase
        cursor-pointer
        pagination
        text-center
        "
    >
      {{ pageNo }}
    </nuxt-link>&nbsp;
    <nuxt-link
      :to="nextPage ? `/blog/${pageNo + 1}` : `/blog/${pageNo}`"
      :class="`
        px-2
        py-2
        text-lg
        text-xl
        text-white
        shadow
        rounded-lg
        mx-1
        mt-1
        uppercase
        cursor-pointer
        ${nextPage ? 'pagination' : 'pagination-disabled'}
        `"
    >
      &nbsp;→&nbsp;
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    paginatedItems: {
      type: Array,
      default: () => []
    },
    nextPage: {
      type: Boolean,
      default: false
    },
    pageNo: {
      type: Number,
      default: 0
    },
    allItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    prevLink () {
      return this.pageNo === 1 ? '/blog/1' : `/blog/${this.pageNo - 1}`
    }
  }
}
</script>

<style scoped>
.pagination {
  background-color: var(--color-primary);
}
.pagination-disabled {
  background-color: gray;
  cursor: not-allowed;
}
</style>
