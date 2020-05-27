import OlStyle from 'ol/style/Style';
import OlStroke from 'ol/style/Stroke';
import OlFill from 'ol/style/Fill';
import OlCircle from 'ol/style/Circle';
import store from '../store/modules/map';

export function defaultStyle(feature) {
  const geomType = feature.getGeometry().getType();
  const style = new OlStyle({
    fill: new OlFill({
      color: ['MultiPolygon', 'Polygon'].includes(geomType)
        ? '#FF0000'
        : [0, 0, 0, 0]
    }),
    stroke: new OlStroke({
      color: ['MultiPolygon', 'Polygon'].includes(geomType)
        ? '#FF0000'
        : '#FF0000',
      width: 3
    }),
    image: new OlCircle({
      radius: 7,
      fill: new OlFill({
        color: '#FF0000'
      })
    })
  });
  return [style];
}

/**
 * Style used for popup selected feature highlight
 */

export function popupInfoStyle() {
  // MAJK: PopupInfo layer style (used for highlight)
  const styles = [];
  styles.push(
    new OlStyle({
      stroke: new OlStroke({
        color: 'rgba(236, 236, 236, 0.7)',
        width: 20
      })
    })
  );
  styles.push(
    new OlStyle({
      fill: new OlFill({
        color: 'rgba(255,0,0, 0.2)'
      }),
      stroke: new OlStroke({
        color: '#ff0000',
        width: 4
      }),
      image: new OlCircle({
        radius: 14,
        fill: new OlFill({
          color: '#ff0000'
        })
      })
    })
  );

  return styles;
}

/**
 * Style function used for vector layers.
 */
const styleCache = {};
export function baseStyle(propertyName, config) {
  const styleFunction = feature => {
    const propertyValue = feature.get(propertyName);
    if (propertyValue && !styleCache[propertyValue]) {
      const {
        strokeColor,
        strokeWidth,
        lineDash,
        fillColor,
        circleRadiusFn
      } = config;
      const geometryType = feature.getGeometry().getType();
      switch (geometryType) {
        /**
         * Style used for geometry point type. It will render a circle based on the given formula
         */
        case 'Point':
        case 'MultiPoint': {
          styleCache[propertyValue] = new OlStyle({
            image: new OlCircle({
              stroke: new OlStroke({
                color: strokeColor || 'rgba(255, 255, 255, 1)',
                width: strokeWidth || 1
              }),
              fill: new OlFill({
                color: fillColor || 'rgba(129, 56, 17, 0.7)'
              }),
              radius: circleRadiusFn ? circleRadiusFn(propertyValue) : 5
            })
          });
          break;
        }
        /**
         * Style used for line geometry type.
         */
        case 'LineString':
        case 'MultiLineString': {
          styleCache[propertyValue] = new OlStyle({
            stroke: new OlStroke({
              color:
                strokeColor instanceof Function
                  ? strokeColor()
                  : strokeColor || 'rgba(255, 255, 255, 1)',
              width: strokeWidth || 4,
              lineDash: lineDash || [6]
            })
          });
          break;
        }
        default:
          break;
      }
    }
    return styleCache[propertyValue] || defaultStyle;
  };
  return styleFunction;
}

export function gasePipeStyle() {
  const styleFunction = feature => {
    const entity = feature.get('Operator');
    if (store.state.gasFieldEntitiesColors[entity] && entity) {
      if (!styleCache[entity]) {
        styleCache[entity] = new OlStyle({
          stroke: new OlStroke({
            color: store.state.gasFieldEntitiesColors[entity],
            width: 1.5
          })
        });
      }
      return styleCache[entity];
    } else {
      return new OlStyle({
        stroke: new OlStroke({
          color: '#00c8f0',
          width: 1.5
        })
      });
    }
  };
  return styleFunction;
}

export const styleRefs = {
  defaultStyle: defaultStyle,
  popupInfoStyle: popupInfoStyle,
  baseStyle: baseStyle,
  gasePipeStyle: gasePipeStyle
};

export const layersStylePropFn = {
  CancelledOilLines: {
    strokeColor: propertyValue => propertyValue
  },
  Spills_20yrs: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue);
    }
  },
  GiantOilFields: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.3;
    }
  },
  Coal_Mines: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) / 150;
    }
  }
};
