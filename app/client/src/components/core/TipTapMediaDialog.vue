<template>
  <v-dialog v-model="show" persistent max-width="500px">
    <v-card v-if="command">
      <v-app-bar flat color="#dc143c" height="50" dark>
        <v-icon class="mr-3">{{ data[type].toolbar_icon }}</v-icon>
        <v-toolbar-title>{{ data[type].toolbar_title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-divider></v-divider>
      <v-progress-linear
        :active="isUploadInProgress"
        indeterminate
        color="#dc143c"
      ></v-progress-linear>

      <v-tabs
        v-if="type === 'audio' || type === 'image'"
        v-model="tab"
        fixed-tabs
      >
        <v-tab>
          Upload File
        </v-tab>
        <v-tab>
          Add Link
        </v-tab>

        <v-tabs-items v-model="tab">
          <v-divider></v-divider>

          <v-tab-item>
            <v-alert
              dense
              class="mx-2 my-1"
              v-if="isUploadedSuccessful === true"
              type="success"
            >
              File uploaded. Click apply to insert it!
            </v-alert>
            <v-alert dense type="error" v-if="isUploadedSuccessful === false">
              File can't upload.
            </v-alert>
            <v-file-input
              v-if="type === 'audio'"
              :disabled="isUploadInProgress"
              v-model="file"
              @change="readFile"
              @click:clear="clearFile"
              clearable
              prepend-icon="music_video"
              class="mx-4 mt-4"
              accept="audio/*"
              label="Audio File input"
            ></v-file-input>
            <v-file-input
              v-if="type === 'image'"
              :disabled="isUploadInProgress"
              v-model="file"
              @change="readFile"
              @click:clear="clearFile"
              clearable
              prepend-icon="image"
              class="mx-4 mt-4"
              accept="image/png, image/jpeg"
              label="Image File input"
            ></v-file-input>
          </v-tab-item>
          <v-tab-item>
            <v-text-field
              v-model="urlSrc"
              class="mx-4 mt-4"
              prepend-icon="link"
              label="Paste URL"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <v-card-text v-if="type === 'iframe'">
        <v-text-field class="mt-4" v-model="urlSrc" id="url" label="URL" />
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="show = false">
          Close
        </v-btn>
        <v-btn
          :disabled="
            (tab === 1 && !urlSrc) ||
              (tab === 0 && !s3Src) ||
              (tab === null && !urlSrc)
          "
          color="primary"
          text
          @click="insert"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { parseVideoUrl } from '../../utils/Helpers';

import authHeader from '../../services/auth-header';
import axios from 'axios';

export default {
  data() {
    return {
      isUploadInProgress: false,
      isUploadedSuccessful: '',
      file: null,
      tab: null,
      urlSrc: '',
      s3Src: '',
      command: null,
      show: false,
      data: {
        image: {
          toolbar_icon: 'image',
          toolbar_title: 'Image Insert'
        },
        audio: {
          toolbar_icon: 'music_video',
          toolbar_title: 'Audio Insert'
        },
        iframe: {
          toolbar_icon: 'video_library',
          toolbar_title: 'Video Insert'
        }
      }
    };
  },
  methods: {
    showModal(command, type) {
      // Add the sent command
      this.clear();
      this.command = command;
      this.type = type;
      this.show = true;
    },
    insert() {
      let src = '';
      if (this.type === 'iframe') {
        src = parseVideoUrl(this.urlSrc);
      } else {
        src = this.tab === 0 ? this.s3Src : this.urlSrc;
      }
      const data = {
        command: this.command,
        data: {
          src
        }
      };

      this.$emit('onConfirm', data);
      this.show = false;
    },
    readFile(file) {
      console.log(this.tab);
      if (file) {
        // UPLOAD IN S3 Bucket.
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        this.isUploadInProgress = true;
        axios
          .post('api/upload', formData, {
            headers: authHeader()
          })
          .then(res => {
            if (res.data.fileUrl) {
              this.s3Src = res.data.fileUrl;
              this.isUploadedSuccessful = true;
            }
            this.isUploadInProgress = false;
          })
          .catch(() => {
            this.isUploadInProgress = false;
            this.isUploadedSuccessful = false;
          });
      }
    },
    clearFile() {
      this.file = null;
      this.isUploadedSuccessful = '';
      this.s3Src = '';
    },
    clear() {
      this.tab = null;
      this.type = null;
      this.clearFile();
      this.urlSrc = '';
    }
  },
  computed: {}
};
</script>
