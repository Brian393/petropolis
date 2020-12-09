<template>
  <div>
    <media-dialog ref="mediadialog" @onConfirm="addCommand" />

    <tip-tap-expansion-dialog
      ref="tiptap-expansion-dialog"
      @onConfirm="addCommand"
    ></tip-tap-expansion-dialog>

    <tiptap-vuetify
      ref="tiptap"
      style="line-height:1.2;"
      class="custom-style"
      :card-props="{ flat: true }"
      v-model="htmlContent"
      placeholder="Write something"
      :extensions="extensions"
      :native-extensions="nativeExtensions"
      @init="onInit"
    >
      <template #toolbar-after class="pb-2">
        <div style="background-color: #f5f5f5;">
          <!--You can render the buttons as you wish (you can see in the source code how this is done).-->
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="{
                  'ml-3': true,
                  'tiptap-vuetify-editor__action-render-btn': true
                }"
                @click="openModal('image')"
                small
                icon
              >
                <v-icon>image</v-icon>
              </v-btn>
            </template>
            <span>Add Image</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="{
                  'tiptap-vuetify-editor__action-render-btn': true
                }"
                small
                icon
                @click="openModal('iframe')"
              >
                <v-icon>video_library</v-icon>
              </v-btn>
            </template>
            <span>Add Video</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="{
                  'tiptap-vuetify-editor__action-render-btn': true
                }"
                small
                icon
                @click="openModal('audio')"
              >
                <v-icon>music_video</v-icon>
              </v-btn>
            </template>
            Add audio
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="{
                  'tiptap-vuetify-editor__action-render-btn': true
                }"
                small
                icon
                @click="openModal('expansion')"
              >
                <v-icon>playlist_add</v-icon>
              </v-btn>
            </template>
            Add Expansion panel
          </v-tooltip>
        </div>
      </template>
    </tiptap-vuetify>
  </div>
  <!-- Use the component in the right place of the template -->
</template>

<script>
import { mapFields } from 'vuex-map-fields';

import Iframe from './TipTapIframe';
import Audio from './TipTapAudio';
import Image from './TipTapImage';
import Expansion from './TipTapExpansion';

import MediaDialog from './TipTapMediaDialog';
import TipTapExpansionDialog from './TipTapExpansionDialog';
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
  // Image,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from 'tiptap-vuetify';

export default {
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify, MediaDialog, TipTapExpansionDialog },
  data: () => ({
    editor: null,
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
      HardBreak
    ],
    nativeExtensions: [new Iframe(), new Audio(), new Image(), new Expansion()]
  }),
  computed: {
    ...mapFields('map', {
      htmlContent: 'htmlContent'
    })
  },
  methods: {
    openModal(command) {
      if (this.editor) {
        if (command === 'expansion') {
          this.$refs['tiptap-expansion-dialog'].showModal(
            this.editor.commands[command],
            command
          );
        } else {
          this.$refs['mediadialog'].showModal(
            this.editor.commands[command],
            command
          );
        }
      }
    },
    addCommand(data) {
      if (data.command !== null) {
        data.command(data.data);
      }
    },
    onInit(editor) {
      this.editor = editor.editor;
    }
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
