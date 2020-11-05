<template>
  <div>
    <v-text-field v-model="form.src" label="Image URL" />
    <v-text-field v-model="form.alt" label="Alternative Text" />
    <v-btn @click="addImage">
      Add Image
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        src: null,
        alt: null
      }
    };
  },
  methods: {
    addImage() {
      this.$emit('select-file', {
        src: this.form.src,
        alt: this.form.alt
      });
      this.form.src = null;
      this.form.alt = null;
    }
  }
};
</script>
<style scoped></style>
