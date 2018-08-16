<template>
  <article :class="accordionClasses">
    <div @click="toggleAccordion" class="heading">
      <i class="material-icons" v-if="isOpen">keyboard_arrow_up</i>
      <i class="material-icons" v-else>keyboard_arrow_down</i>
      <slot name="header"></slot>
    </div>
    <div class="body">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </article>
</template>
<style scoped>
.heading {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #88170e;
}
.body   {
  padding: 0;
  max-height: 10em;
  overflow: hidden;
  transition: 0.5s ease all;
}
.is-closed .body {
  max-height: 0;
}
.content {
  padding: 20px;
}
</style>
<script>
export default {
  name: 'Accordion',
  props: {
    open: Boolean
  },
  data: function () {
    return {
      isOpen: this.open
    }
  },
  computed: {
    accordionClasses: function () {
      return {
        'is-closed': !this.isOpen
      }
    }
  },
  methods: {
    toggleAccordion: function () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
