import '@fortawesome/fontawesome-free/css/all.css'; // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { TiptapVuetifyPlugin } from 'tiptap-vuetify';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'md' // default - only for display purposes
  }
});

Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'md'
});

export default vuetify;
