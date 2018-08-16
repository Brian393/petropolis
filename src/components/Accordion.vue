<template>
  <article :class="accordionClasses" ref="accordion">
    <div @click="toggleAccordion" class="heading">
      <i class="material-icons" v-if="isOpen">keyboard_arrow_up</i>
      <i class="material-icons" v-else>keyboard_arrow_down</i>
      <span class="headingText"><slot name="header"></slot></span>
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
.headingText:hover {
  text-decoration: underline;
}
.body   {
  padding: 0;
  max-height: 100vh;
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
      if (this.isOpen && this.$refs.accordion.offsetTop > window.innerHeight) {
        setTimeout( () => {
          this.$refs.accordion.scrollIntoView()
        }, 500)
      }
    }
  }
}
</script>
