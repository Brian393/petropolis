# ecotopia-today

A Vue.js app programmed by edward sharp, based on a prototype by Brian Holmes. 

🗣 [OpenLayers](https://openlayers.org/)  
🗣 [vue-image-lightbox](https://www.npmjs.com/package/vue-image-lightbox)  

https://github.com/Brian393
http://ecotopia.today/

## Project setup

```sh
npm install
```

#### Compiles and hot-reloads for development

```sh
npm start
```

#### Compiles and minifies for production

```sh
npm run build
```

#### Lints and fixes files

```sh
npm run lint
```

#### Build & Deploy

note: change the `baseUrl` option in the `vue.config.js` file accordingly.

```sh
npm run build
```

Everything inside the dist/ folder can be copied to your webserver.

#### Deploy to GitHub Pages

```sh
npm run deploy
```

## Components

### `<Accordion/>`

Import the `Accordion.vue` component (note: relative path for import) & declare this in the `components` object, like so:

```
<script>
import Accordion from '../../components/Accordion.vue'
export default {
  name: 'ExampleComponent',
  components: {
    Accordion
  }
}
</script>
```

Then in your `<template>` use like so:

```
<Accordion :open="true">
  <h2 slot="header">Title Link Text</h2>
  Content to hide/show goes here.
</Accordion>
```

### `<AppLightBox/>`

Import the `AppLightBox.vue` component (note: relative path for import), declare AppLightBox in the `components` object, & setup an array property with images, like so:

```
<script>
import AppLightBox from '../../components/AppLightBox.vue'
export default {
  name: 'ExampleComponent',
  components: {
    AppLightBox
  },
  data: function () {
    return {
      damImages: [
        {
          thumb: 'images/Dams/ArrowLakesDam.jpg',
          src: 'images/Dams/ArrowLakesDam.jpg',
          caption: '<b>Arrow Lakes Dam</b>'
        },
        {
          thumb: 'images/Dams/BonnevilleDam.jpg',
          src: 'images/Dams/BonnevilleDam.jpg',
          caption: 'Bonneville Dam'
        }
      ]
    }
  }
}
</script>
```

Then in your `<template>` use like so:

```
<AppLightBox :images="damImages">A Dam Light Box</AppLightBox>
```

Further customization of `<LightBox/>`. See: https://www.npmjs.com/package/vue-image-lightbox#properties for all configuration options provided by this module. To extend more options (for example the `showThumbs` property) from this module do something like:

Add the `showThumbs` property to `AppLightBox.vue`:

```
<LightBox v-if="isOpen" :images="images" :showCaption="true" @onOpened="onOpenChange" :showThumbs="false"></LightBox>
```

This will make every instance of `<AppLightBox/>` not show thumbnails. If we want to extend & proxy these properties via `<AppLightBox/>` then we just need to setup this property in `AppLightBox.vue` like so:

add a new key & type value in the `props` object:

```js
props: {
  images: Array,
  showThumbs: Boolean
}
```

set the `<LightBox/>` element to use this property:

```
<LightBox :showThumbs="showThumbs"></LightBox>
```

then you can customize this per `<AppLightBox/>` instance like so:

```
<AppLightBox :showThumbs="true">A Dam Light Box</AppLightBox>
```

### `<Map/>`

The map component is a wrapper for working with the openlayers library. Different map views are managed via the [Vue Router](https://router.vuejs.org/) (see: `router.js`) so `<router-link>` elements can be used to navigate to different map views. Each different map view has a corresponding method to setup (init) the OpenLayers map details. Generally there's some set of layers that will be used on every map view so those are stored in a common method that returns those layers (see: `watershedBaseLayers()`). Then each particular view can `.concat()` any additional layers needed.

There's also some functionality to:  
* handle resizing the map when the aside conent is hidden/shown (via [Vuex](https://vuex.vuejs.org/) see: `store.js`)  
* close any open popups when navigating to another view

At the moment only the Watershed map views are built. In the future `Map.vue` will move to `MapWatershed.vue` and the other two main map categories will have corresponding component files (e.g. MapBioregion.vue & MapMegaregion.vue).


## misc.

### links to re-position map

```js
import {eventBus} from '../../main'
```

declare an emit method like so:

```js
methods: {
    emit: function (method, args) {
      eventBus.$emit(method, args)
    }
  }
```

Use in `<template>`s like so:

```html
<span class="link" @click="emit('set-map-view', {center: [-121.2, 51.0], resolution: 4500, minResolution: 1, maxResolution: 16000})">set-map-view</span>
```

_note_ minResolution & maxResolution are optional.

### util/sort_dam_json.js

a simple utility to re-sort the .geojson files used for layers via `watershedDamsTransformationLayers` in chronological order. to use:

```sh
cd util/
./sort_dam_json.js
```

<hr>
<p align="center">
made with 🖤 in NYC
</p>
