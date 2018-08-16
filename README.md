# ecotopia-today 

A Vue.js app based on a prototype by Brian Holmes (@Brian393). 

🗣 [OpenLayers](https://openlayers.org/)  
🗣 [vue-image-lightbox](https://www.npmjs.com/package/vue-image-lightbox)  
🗣 [vue-tweet-embed](https://github.com/tonickkozlov/vue-tweet-embed)

https://edwardsharp.github.io/ecotopia-today/

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

### `<Map/>`

The map component is a wrapper for working with the openlayers library. Different map views are managed via the [Vue Router](https://router.vuejs.org/) (see: `router.js`) so `<router-link>` elements can be used to navigate to different map views. Each different map view has a corresponding method to setup (init) the OpenLayers map details. Generally there's some set of layers that will be used on every map view so those are stored in a common method that returns those layers (see: `watershedBaseLayers()`). Then each particular view can `.concat()` any additional layers needed. 

There's also some functionality to:  
* handle resizing the map when the aside conent is hidden/shown (via [Vuex](https://vuex.vuejs.org/) see: `store.js`)  
* close any open popups when navigating to another view

At the moment only the Watershed map views are built. In the future `Map.vue` will move to `MapWatershed.vue` and the other two main map categories will have corresponding component files (e.g. MapBioregion.vue & MapMegaregion.vue). 


*made with 🖤 in NYC*
