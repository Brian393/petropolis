<template>
  <a href="#" class="info-pop-up__link" v-bind:isLoading="isLoading" v-on:click="this.handleInfoPopUpLinkClick">
    <span class="info-pop-up__wrapper-inner">
      <slot></slot>
      <span class="info-pop-up__load-wrapper" v-bind:style="`visibility: ${ isLoading ? 'visible' : 'hidden'}; height: ${ isLoading ? '1em' : '0px'}; vertical-align: middle;`">
        <img class="info-pop-up__load" align="middle"  src="/icons/ball-loader.gif"/>
      </span>
    </span>
  </a>
</template>

<script>
  import {appSelector} from '../main.js';

  /**
   * Launch a modal based on a filename pointing to an HTML file located in public/html/filename.html.
   * The title of the modal is derived from turning "-" into spaces and titlecasing the words.
   *
   * Example 1:
   * <info-pop-up :fileName="'pipeline-list'">
   *   test click me!!!
   * </info-pop-up>
   * ^ That would load the file public/html/pipeline-list.html with the title "Pipeline List" when clicked.
   *
   * Example 2:
   * http://localhost:8081/#/?infoPopUp=pipeline-list
   * ^ That would load the file public/html/pipeline-list.html with the title "Pipeline List" on app load.
   *
   * @param app {Object}: the "this" vuejs object
   * @param fileName {String}: the string which will become the filename that will be fetched from public/html/fileName.html
   * @param isLink {Boolean}: If true add isLoading to the data and add the query string to the URL.
   */
  const doInfoPopUp = function(app, fileName, isLink) {
    try {
      if (!fileName) {
        throw new Error('You didn\'t provide a filename properly. Please use v-bind:fileName="\'myfile\'", without ".html" at the end.');
      }
      let cleanedFilename = fileName.trim();
      if (fileName.endsWith('.html')) {
        cleanedFilename = cleanedFilename.substring(0, cleanedFilename.length - 5);
      }
      // Strip out any special characters from the URL to make this secure. Only alphanumeric and - and _.
      cleanedFilename = cleanedFilename.replace(/[^a-zA-Z0-9/-]+/g, '');
      fetch(`/html/${cleanedFilename}.html`)
        .then((res) => {
          res.text().then((html) => {
            const title = cleanedFilename.replace('-', ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            if (isLink) {
              app.$data.isLoading = false;
              // Push the infoPopUp name into the query string to make a shareable URL.
              app.oldUrl = window.location.href;
              window.history.replaceState(
                {oldUrl: window.location.href, oldTitle: document.title},
                title,
                window.location.href + `?infoPopUp=${cleanedFilename}`
              );
            }
            app.$modal.show({
              template: `
                  <div class="info-pop-up__modal-inner">
                    <div class="info-pop-up__modal-close-wrapper">
                    <button class="info-pop-up__modal-close" @click="$modal.hide('info-pop-up')">
                      ❌
                    </button>
                  </div>
                    <h1>${title}</h1>
                    ${html}
                  </div>
                `,
            }, {
            }, {
              height: 'auto',
              scrollable: true,
              name: 'info-pop-up'
            }, {
              'before-close': (event) => {
                // Get rid of all the query params from the URL
                window.history.replaceState(
                  {  },
                  document.title,
                  window.location.href.split('?')[0]
                );
              }
            })
          });
        });
    } catch (e) {
      console.warn(e);
    }
  };

  const infoPopUpName = 'info-pop-up';

  const InfoPopUp = {
    props: {
      fileName: String,
      title: String,
    },
    data: function() {
      return {
        isLoading: false,
      }
    },
    methods: {
      handleInfoPopUpLinkClick: function() {
        this.$data.isLoading = true;
        this.doInfoPopUp(this, this.fileName, true)
      },
      doInfoPopUp,
    },
  }

  window.infoPopupHtml = (fileName) => {
    return (e) => {
      const app = document.querySelector(appSelector)['__vue__'];
      const isLink = true;
      e.preventDefault();
      doInfoPopUp(app, fileName, isLink);
    }
  };

  export {InfoPopUp as default, infoPopUpName, doInfoPopUp};
</script>

<style>
  .info-pop-up__modal-inner {
    padding: 1em;
  }

  .info-pop-up__modal-close-wrapper {
    text-align: right;
  }

  .info-pop-up__modal-close {
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .info-pop-up__load-wrapper {
    height: 1em;
    width: 1em;
    display: inline-flex;
    overflow: hidden;
    position: relative;
  }

  .info-pop-up__load {
    position: absolute;
    height: 100%;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
  }

</style>
