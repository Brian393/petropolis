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

  /**
   * Returns the corresponding style of the layer based on configuration.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.style} Ol Style
   */
  getStyle(lConf) {
    const styleProps = lConf.style;
    const styleRef = lConf.styleRef;
    const stylePropFnRef = lConf.stylePropFnRef;
    const styleField = lConf.styleField;

    if (
      styleProps &&
      styleRef &&
      stylePropFnRef &&
      styleField &&
      styleRefs[styleRef] &&
      layersStylePropFn[lConf.name] &&
      layersStylePropFn[lConf.name][stylePropFnRef]
    ) {
      const styleFn = styleRefs[styleRef];
      const stylePropsFn = layersStylePropFn[lConf.name];
      const props = { ...styleProps, ...stylePropsFn };
      return styleFn(styleField, props);
    } else if (styleRef) {
      return styleRefs[lConf.styleRef]();
    } else {
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
      displayInLayerList: lConf.displayInLayerList,
      displayInLegend: lConf.displayInLegend,
      visible: lConf.visible,
      opacity: lConf.opacity,
      queryable: lConf.queryable,
      requiresPois: lConf.requiresPois,
      ratio: lConf.ratio ? lConf.ratio : 1.5,
      zIndex: lConf.zIndex,
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
      displayInLayerList: lConf.displayInLayerList,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      preload: lConf.preload ? parseFloat(lConf.preload) : 0, // Parse float is used because it's not possible to add values like Infinity in json config
      zIndex: lConf.zIndex,
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
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      opacity: lConf.opacity,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
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
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      opacity: lConf.opacity,
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
      displayInLayerList: lConf.displayInLayerList,
      minResolution: lConf.minResolution,
      maxZoom: lConf.maxZoom,
      visible: lConf.visible,
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
      displayInLayerList: lConf.displayInLayerList,
      minResolution: lConf.minResolution,
      maxZoom: lConf.maxZoom,
      visible: lConf.visible,
      opacity: lConf.opacity,
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
      displayInLayerList: lConf.displayInLayerList,
      extent: lConf.extent,
      queryable: lConf.queryable,
      showZoomToFeature: lConf.showZoomToFeature,
      visible: lConf.visible,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
      isInteractive: lConf.isInteractive,
      opacity: lConf.opacity,
      zIndex: lConf.zIndex,
      source: new VectorSource(sourceConfig),
      style: this.getStyle(lConf),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute,
      label: lConf.label
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
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      minResolution: lConf.minResolution,
      maxResolution: lConf.maxResolution,
      isInteractive: lConf.isInteractive,
      opacity: lConf.opacity,
      source: new VectorTileSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](),
        attributions: lConf.attributions
      }),
      style: this.getStyle(lConf),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute
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
      displayInLayerList: lConf.displayInLayerList,
      queryable: lConf.queryable,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: vectorSource,
      style: this.getStyle(lConf)
    });

    return layer;
  }
};
