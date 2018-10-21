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
  color: #5a005a;
  margin-top:20px;
  margin-bottom:30px;
  justify-content: center;

}
.headingText:hover {
  text-decoration: underline;
}
.material-icons {
font-size: 20px;
}
.body   {
  padding: 0;
  max-height: 100%;
  overflow: hidden;
  transition: 0.5s ease all;
}
.is-closed .body {
  max-height: 0;
}
.content {
  border-radius: 10px;
  border: 2px solid #5a005a;
  padding: 20px;
}
.legendtext {
  margin-top: 15px;            /* THIS IS EXPERIMENTAL */
  margin-bottom: 5px;          /* idea is to control line space only here */
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
        setTimeout(() => {
          this.$refs.accordion.scrollIntoView()
        }, 500)
      }
    }
  }
}
</script>
