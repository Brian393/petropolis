/* eslint-disable no-prototype-builtins */
import TileLayer from 'ol/layer/Tile';
import TileWmsSource from 'ol/source/TileWMS';
import OsmSource from 'ol/source/OSM';
import EsriJSON from 'ol/format/EsriJSON';
import { tile as tileStrategy } from 'ol/loadingstrategy';
import { createXYZ } from 'ol/tilegrid';
import BingMaps from 'ol/source/BingMaps';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MvtFormat from 'ol/format/MVT';
import GeoJsonFormat from 'ol/format/GeoJSON';
import TopoJsonFormat from 'ol/format/TopoJSON';
import KmlFormat from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ImageWMS from 'ol/source/ImageWMS.js';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Image as ImageLayer } from 'ol/layer.js';
import XyzSource from 'ol/source/XYZ';
import { OlStyleFactory } from './OlStyle';
import { styleRefs, layersStylePropFn } from '../style/OlStyleDefs';
import http from '../services/http';

/**
 * Factory, which creates OpenLayers layer instances according to a given config
 * object.
 */
export const LayerFactory = {
  /**
   * Maps the format literal of the config to the corresponding OL module.
   * @type {Object}
   */
  formatMapping: {
    MVT: MvtFormat,
    GeoJSON: GeoJsonFormat,
    TopoJSON: TopoJsonFormat,
    KML: KmlFormat
  },

  computeQuadKey: function(x, y, z) {
    let quadKeyDigits = [];
    for (let i = z; i > 0; i--) {
      let digit = 0;
      const mask = 1 << (i - 1);
      if ((x & mask) !== 0) {
        digit++;
      }
      if ((y & mask) !== 0) {
        digit = digit + 2;
      }
      quadKeyDigits.push(digit);
    }
    return quadKeyDigits.join('');
  },

  getStyles(lConf) {
    if (!lConf.style) return;
    if (lConf.style.featureStyles && Array.isArray(lConf.style.featureStyles)) {
      const styleArray = [];
      lConf.style.featureStyles.forEach(style => {
        const renderedStyle = this.renderStyle(style, lConf.name);
        styleArray.push(renderedStyle);
      });
      return (feature, resolution) => {
        const styles = [];
        styleArray.forEach(style => {
          if (style instanceof Function) {
            styles.push(style(feature, resolution));
          } else {
            styles.push(style);
          }
        });
        return styles;
      };
    } else {
      return this.renderStyle(lConf.style, lConf.name);
    }
  },

  /**
   * Returns the corresponding style of the layer based on configuration.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.style} Ol Style
   */
  renderStyle(styleProps, layerName) {
    let { styleRef, stylePropFnRef } = styleProps;
    if (stylePropFnRef && !styleRef) {
      styleRef = 'baseStyle';
    }
    if (styleProps && styleRef && stylePropFnRef && styleRefs[styleRef]) {
      // Get style function reference (default is baseStyle)
      const styleFn = styleRefs[styleRef];
      // Get the functions of the layer
      const stylePropFn = {};
      // Get property function from layer config object or default object
      Object.keys(stylePropFnRef).forEach(fnName => {
        let fn;
        if (layersStylePropFn[layerName]) {
           fn =
            layersStylePropFn[layerName][fnName] ||
            layersStylePropFn.default[fnName];
        } else {
          if (layersStylePropFn.default[fnName]) {
            fn = layersStylePropFn.default[fnName]
          }
        }
        if (fn) {
          stylePropFn[fnName] = fn;
        }
      });
      const props = { ...styleProps, ...stylePropFn, layerName };
      return styleFn(props,layerName);
    } else if (styleRef) {
      // Edge case for colormap palete
      if (styleRef === 'colorMapStyle') {
        return styleRefs[styleRef](
          layerName,
          styleProps.colorField,
          styleProps.colormap
        );
      }
      return styleRefs[styleRef](layerName);
    } else {
      // Just a generic style 
      return OlStyleFactory.getInstance(styleProps);
    }
  },

  /**
   * Returns an OpenLayers layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Base} OL layer instance
   */
  getInstance(lConf) {
    // apply LID (Layer ID) if not existant
    if (!lConf.lid) {
      var now = new Date();
      lConf.lid = now.getTime();
    }

    // create correct layer type
    if (lConf.type === 'WMS') {
      return this.createWmsLayer(lConf);
    } else if (lConf.type === 'WMSTILE') {
      return this.createWmsTileLayer(lConf);
    } else if (lConf.type === 'XYZ') {
      return this.createXyzLayer(lConf);
    } else if (lConf.type === 'OSM') {
      return this.createOsmLayer(lConf);
    } else if (lConf.type === 'BING') {
      return this.createBingLayer(lConf);
    } else if (lConf.type === 'BING-QUADKEY') {
      return this.createBingQuadKeyLayer(lConf);
    } else if (lConf.type === 'VECTOR') {
      return this.createVectorLayer(lConf);
    } else if (lConf.type === 'VECTORTILE') {
      return this.createVectorTileLayer(lConf);
    } else if (lConf.type === 'ESRI') {
      return this.createESRIFeatureService(lConf);
    } else {
      return null;
    }
  },

  /**
   * Returns an OpenLayers WMS layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL WMS layer instance
   */
  createWmsLayer(lConf) {
    const layer = new ImageLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      visible: lConf.visible,
      opacity: lConf.opacity,
      queryable: lConf.queryable,
      requiresPois: lConf.requiresPois,
      ratio: lConf.ratio ? lConf.ratio : 1.5,
      zIndex: lConf.zIndex,
      group: lConf.group,
      source: new ImageWMS({
        url: lConf.url,
        params: {
          LAYERS: lConf.layers
        },
        serverType: lConf.serverType ? lConf.serverType : 'geoserver',
        ratio: lConf.ratio,
        attributions: lConf.attributions
      })
    });

    return layer;
  },
  /**
   * Returns an OpenLayers WMS Tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL WMS layer instance
   */
  createWmsTileLayer(lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      preload: lConf.preload ? parseFloat(lConf.preload) : 0, // Parse float is used because it's not possible to add values like Infinity in json config
      zIndex: lConf.zIndex,
      group: lConf.group,
      source: new TileWmsSource({
        url: lConf.url,
        params: {
          LAYERS: lConf.layers,
          TILED: lConf.tiled
        },
        serverType: lConf.serverType ? lConf.serverType : 'geoserver',
        attributions: lConf.attributions
      })
    });

    return layer;
  },

  /**
   * Returns an XYZ based tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL XYZ layer instance
   */
  createXyzLayer(lConf) {
    const xyzLayer = new TileLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      visible: lConf.visible,
      opacity: lConf.opacity,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
      group: lConf.group,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      source: new XyzSource({
        url: lConf.hasOwnProperty('accessToken')
          ? lConf.url + '?access_token=' + lConf.accessToken
          : lConf.url,
        maxZoom: lConf.maxZoom || 18,
        attributions: lConf.attributions,
        tilePixelRatio: lConf.tilePixelRatio || 1,
        crossOrigin: lConf.crossOrigin,
        opaque: lConf.opaque || true
      })
    });

    return xyzLayer;
  },

  /**
   * Returns an OpenLayers OSM layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL OSM layer instance
   */
  createOsmLayer(lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      visible: lConf.visible,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      opacity: lConf.opacity,
      group: lConf.group,
      source: new OsmSource({
        url: lConf.url,
        maxZoom: lConf.maxZoom
      })
    });

    return layer;
  },

  /**
   * Returns an OpenLayers BING layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL BING layer instance
   */
  createBingLayer(lConf) {
    const bingMaps = new BingMaps({
      key: lConf.accessToken,
      imagerySet: lConf.imagerySet,
      maxZoom: lConf.maxZoom
    });
    const layer = new TileLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      minResolution: lConf.minResolution,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      maxZoom: lConf.maxZoom,
      visible: lConf.visible,
      group: lConf.group,
      opacity: lConf.opacity,
      source: bingMaps
    });

    return layer;
  },

  /**
   * Returns an OpenLayers BING layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL BING layer instance
   */
  createBingQuadKeyLayer(lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      minResolution: lConf.minResolution,
      maxZoom: lConf.maxZoom,
      visible: lConf.visible,
      opacity: lConf.opacity,
      group: lConf.group,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      source: new XyzSource({
        tileUrlFunction: tileCoord => {
          const z = tileCoord[0];
          const x = tileCoord[1];
          const y = -tileCoord[2] - 1;
          return lConf.url + this.computeQuadKey(x, y, z) + '.jpg';
        }
      })
    });

    return layer;
  },

  /**
   * Returns an OpenLayers vector layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Vector} OL vector layer instance
   */
  createVectorLayer(lConf) {
    let url;
    const sourceConfig = {
      format: new this.formatMapping[lConf.format](lConf.formatConfig),
      attributions: lConf.attributions
    };
    // Check if url is a WFS service
    if (lConf.url.includes('wfs?service=WFS&')) {
      url = function(extent) {
        return `${lConf.url}&bbox=${extent.join(',')},EPSG:3857`;
      };
      sourceConfig['strategy'] = bboxStrategy;
    } else {
      url = lConf.url;
    }
    sourceConfig['url'] = url;

    const vectorLayer = new VectorLayer({
      type: lConf.type,
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      extent: lConf.extent,
      queryable: lConf.queryable,
      showZoomToFeature: lConf.showZoomToFeature,
      canEdit: lConf.canEdit,
      visible: lConf.visible,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
      isInteractive: lConf.isInteractive,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      includeInSearch: lConf.includeInSearch,
      searchLabel: lConf.searchLabel,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      opacity: lConf.opacity,
      zIndex: lConf.zIndex,
      group: lConf.group,
      source: new VectorSource(sourceConfig),
      style: this.getStyles(lConf),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute,
      label: lConf.label,
      styleObj: JSON.stringify(lConf.style)
    });
    return vectorLayer;
  },

  /**
   * Returns an OpenLayers vector tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.VectorTile} OL vector tile layer instance
   */
  createVectorTileLayer(lConf) {
    const vtLayer = new VectorTileLayer({
      type: lConf.type,
      name: lConf.name,
      title: lConf.title,
      lid: lConf.lid,
      queryable: lConf.queryable,
      showZoomToFeature: lConf.showZoomToFeature,
      visible: lConf.visible,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
      isInteractive: lConf.isInteractive,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      includeInSearch: lConf.includeInSearch,
      searchLabel: lConf.searchLabel,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      opacity: lConf.opacity,
      group: lConf.group,
      renderMode: lConf.renderMode || 'hybrid',
      source: new VectorTileSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](),
        attributions: lConf.attributions
      }),
      style: this.getStyles(lConf),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute,
      styleObj: JSON.stringify(lConf.style)
    });

    return vtLayer;
  },

  /**
   * Returns an OpenLayers vector tilelayer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.VectorTile} OL vector tile layer instance
   */
  createESRIFeatureService(lConf) {
    const esrijsonFormat = new EsriJSON();
    const vectorSource = new VectorSource({
      loader: function(extent, resolution, projection) {
        const url =
          lConf.url +
          lConf.layer +
          '/query/?f=json&' +
          'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
          encodeURIComponent(
            '{"xmin":' +
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":102100}}'
          ) +
          '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
          '&outSR=102100';

        http.get(url).then(response => {
          var features = esrijsonFormat.readFeatures(response.data, {
            featureProjection: projection
          });
          if (features.length > 0) {
            vectorSource.addFeatures(features);
          }
        });
      },
      strategy: tileStrategy(
        createXYZ({
          tileSize: 512
        })
      )
    });

    const layer = new VectorLayer({
      name: lConf.name,
      type: lConf.type,
      title: lConf.title,
      lid: lConf.lid,
      zIndex: lConf.zIndex,
      queryable: lConf.queryable,
      displayInLegend: lConf.displayInLegend,
      displaySidebarInfo: lConf.displaySidebarInfo,
      sidebarDefaultMedia: lConf.sidebarDefaultMedia,
      legendIcon: lConf.legendIcon,
      legendDisplayName: lConf.legendDisplayName,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: vectorSource,
      style: this.getStyles(lConf)
    });

    return layer;
  }
};
