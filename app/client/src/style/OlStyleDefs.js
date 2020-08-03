import OlStyle from 'ol/style/Style';
import OlStroke from 'ol/style/Stroke';
import OlFill from 'ol/style/Fill';
import OlCircle from 'ol/style/Circle';
import OlIconStyle from 'ol/style/Icon';
import store from '../store/modules/map';

let strokeColor = 'rgba(236, 236, 236, 0.7)';
let fillColor = 'rgba(255,0,0, 0.2)';
let imageColor = 'blue';
let zIndex = 100;

// Resets cache when map groups is changed.
import { EventBus } from '../EventBus';
EventBus.$on('group-changed', () => {
  styleCache = {};
});

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
  const styleFunction = () => {
    const styles = [];
    styles.push(
      new OlStyle({
        stroke: new OlStroke({
          color: strokeColor,
          width: 20
        }),
        zIndex: zIndex
      })
    );
    styles.push(
      new OlStyle({
        fill: new OlFill({
          color: fillColor
        }),
        stroke: new OlStroke({
          color: imageColor,
          width: 4
        }),
        image: new OlCircle({
          radius: 7,
          fill: new OlFill({
            color: imageColor
          })
        }),
        zIndex: zIndex
      })
    );

    return styles;
  };
  return styleFunction;
}

export function networkCorpHighlightStyle() {
  const styleFunction = () => {
    const styles = [];
    styles.push(
      new OlStyle({
        fill: new OlFill({
          color: fillColor
        }),
        stroke: new OlStroke({
          color: imageColor,
          width: 4
        }),
        image: new OlCircle({
          radius: 7,
          fill: new OlFill({
            color: imageColor
          })
        })
      })
    );

    return styles;
  };
  return styleFunction;
}

/**
 * Style used for corporate overlay highlight
 */

export function worldOverlayFill() {
  const styleFunction = () => {
    const styles = [];
    styles.push(
      new OlStyle({
        fill: new OlFill({
          color: 'rgba(236, 236, 236, 0.75)'
        }),
        zIndex: 300
      })
    );
    return styles;
  };
  return styleFunction;
}

/**
 * Style function used for vector layers.
 */
let styleCache = {};
export function baseStyle(propertyName, config) {
  const styleFunction = feature => {
    const propertyValue = feature.get(propertyName);
    if (propertyValue === 0) return;
    if (propertyValue && !styleCache[propertyValue]) {
      const {
        strokeColor,
        strokeWidth,
        lineDash,
        fillColor,
        circleRadiusFn,
        iconUrl,
        iconScaleFn,
        scale,
        opacity,
        iconAnchor,
        iconAnchorXUnits,
        iconAnchorYUnits
      } = config;

      const geometryType = feature.getGeometry().getType();
      switch (geometryType) {
        /**
         * Style used for geometry point type. It will render a circle based on the given formula
         */
        case 'Point':
        case 'MultiPoint': {
          let style;
          if (iconUrl || iconScaleFn) {
            style = new OlStyle({
              image: new OlIconStyle({
                src: iconUrl,
                scale: iconScaleFn ? iconScaleFn(propertyValue) : scale || 1,
                opacity: opacity || 1,
                anchor: iconAnchor,
                anchorXUnits: iconAnchorXUnits,
                anchorYUnits: iconAnchorYUnits
              })
            });
          } else {
            style = new OlStyle({
              image: new OlCircle({
                stroke: new OlStroke({
                  color:
                    strokeColor instanceof Function
                      ? strokeColor(propertyValue)
                      : strokeColor || 'rgba(255, 255, 255, 1)',
                  width:
                    strokeWidth instanceof Function
                      ? strokeWidth(propertyValue)
                      : strokeWidth || 1
                }),
                fill: new OlFill({
                  color:
                    fillColor instanceof Function
                      ? fillColor(propertyValue)
                      : fillColor || 'rgba(129, 56, 17, 0.7)'
                }),
                radius: circleRadiusFn ? circleRadiusFn(propertyValue) : 5
              })
            });
          }

          styleCache[propertyValue] = style;
          break;
        }
        /**
         * Style used for line geometry type.
         */
        case 'LineString':
        case 'MultiLineString': {
          const style = new OlStyle({
            stroke: new OlStroke({
              color:
                strokeColor instanceof Function
                  ? strokeColor(propertyValue)
                  : strokeColor || 'rgba(255, 255, 255, 1)',
              width:
                strokeWidth instanceof Function
                  ? strokeColor(propertyValue)
                  : strokeWidth || 4,
              lineDash: lineDash || [6]
            })
          });
          styleCache[propertyValue] = style;
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

export function colorMapStyle(layerName, colorField) {
  const styleFunction = feature => {
    const field = colorField || 'entity';
    const entity = feature.get(field);
    const colors = store.state.colorMapEntities[layerName];
    if (colors && colors[entity] && entity) {
      if (!styleCache[entity]) {
        styleCache[entity] = new OlStyle({
          fill: new OlFill({
            color: colors[entity]
          }),
          stroke: new OlStroke({
            color: colors[entity],
            width: 2.5
          }),
          image: new OlCircle({
            radius: 4,
            fill: new OlFill({
              color: colors[entity]
            })
          })
        });
      }
      return styleCache[entity];
    } else {
      return new OlStyle({
        fill: new OlFill({
          color: '#00c8f0'
        }),
        stroke: new OlStroke({
          color: '#00c8f0',
          width: 1.5
        }),
        image: new OlCircle({
          radius: 4,
          fill: new OlFill({
            color: '#00c8f0'
          })
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
  colorMapStyle: colorMapStyle
};

export const defaultLimits = {
  iconScaleFn: {
    smallestDefaultScale: 0.2,
    largestDefaultScale: 1,
    defaultMultiplier: 300000
  },
  circleRadiusFn: {
    smallestDefaultRadius: 5,
    largestDefaultRadius: 30,
    defaultMultiplier: 0.3
  }
};

const getIconScaleValue = (
  propertyValue,
  multiplier,
  smallestScale,
  largestScale
) => {
  const {
    smallestDefaultScale,
    largestDefaultScale,
    defaultMultiplier
  } = defaultLimits.iconScaleFn;
  const smallestValue = smallestScale || smallestDefaultScale;
  const largestValue = largestScale || largestDefaultScale;
  let scale = multiplier || defaultMultiplier / propertyValue;
  if (scale < smallestValue) {
    scale = smallestValue;
  }
  if (scale > largestValue) {
    scale = largestValue;
  }
  return scale;
};

const getRadiusValue = (
  propertyValue,
  multiplier,
  smallestRadius,
  largestRadius,
  defaultMultiplier
) => {
  const {
    smallestDefaultRadius,
    largestDefaultRadius
  } = defaultLimits.circleRadiusFn;
  const smallestValue = smallestRadius || smallestDefaultRadius;
  const largestValue = largestRadius || largestDefaultRadius;
  let radius = Math.sqrt(propertyValue) * multiplier || defaultMultiplier;
  if (radius < smallestValue) {
    radius = smallestValue;
  }
  if (radius > largestValue) {
    radius = largestValue;
  }
  return radius;
};

export const layersStylePropFn = {
  default: {
    iconScaleFn: propertyValue => {
      return getIconScaleValue(propertyValue);
    },
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue);
    }
  },
  CancelledOilLines: {
    strokeColor: propertyValue => propertyValue
  },
  Spills_20yrs: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.7);
    }
  },
  global_solar: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.3);
    }
  },
  global_wind: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.3);
    }
  },
  nuclear_power: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.3);
    }
  },
  nuclear_power1: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.3;
    }
  },
  nuclear_power2: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.15;
    }
  },
  hydro_power: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.3);
    }
  },
  hydro_power1: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.3;
    }
  },
  hydro_power2: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.15;
    }
  },
  pending_permits: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.008;
    }
  },
  final_permits: {
    circleRadiusFn: propertyValue => {
      return Math.sqrt(propertyValue) * 0.008;
    }
  },
  global_gas: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.15);
    }
  },
  all_refineries: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 1.4);
    }
  },
  GiantOilFields: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.3);
    }
  },
  Coal_Mines: {
    circleRadiusFn: propertyValue => {
      return getRadiusValue(propertyValue, 0.00666);
    }
  }
};
