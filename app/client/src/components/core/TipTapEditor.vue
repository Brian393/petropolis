<template>
  <!-- Use the component in the right place of the template -->
  <tiptap-vuetify
    ref="tiptap"
    style="line-height:1.2;"
    class="custom-style"
    :card-props="{ flat: true }"
    v-model="htmlContent"
    placeholder="Write something"
    :extensions="extensions"
  >
  </tiptap-vuetify>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import ImageUpload from './ImageUpload';
import ImageForm from './ImageForm';

// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  Image,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from 'tiptap-vuetify';

export default {
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  data: () => ({
    // declare extensions you want to use
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3]
          }
        }
      ],
      Bold,
      HorizontalRule,
      HardBreak,
      [
        Image,
        {
          options: {
            imageSources: [
              { component: ImageUpload, name: 'Upload' },
              { component: ImageForm, name: 'URL' }
            ],
            imageSourcesOverride: true
          }
        }
      ]
    ]
  }),
  computed: {
    ...mapFields('map', {
      htmlContent: 'htmlContent'
    })
  }
};
</script>
<style>
.tiptap-vuetify-editor__content {
  border: 1px solid lightgray;
}
.tiptap-vuetify-editor__content img {
  width: 100%;
}
.tiptap-vuetify-editor__content p {
  margin-top: 16px !important;
  margin-bottom: 16px !important;
  min-height: 1rem;
}

.ProseMirror {
  min-height: 350px;
  outline: 0 !important;
  margin: 20px !important;
}
</style>
