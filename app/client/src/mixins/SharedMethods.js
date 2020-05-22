import { getNestedProperty } from '../utils/Helpers';
/**
 * Mixin, which share some reusable methods between componenet.
 */

export const SharedMethods = {
  methods: {
    mapPopupPropName(item) {
      const propertyName = item.property;
      const layerName = this.popup.activeLayer.get('name');
      const popupMapping = this.$appConfig.map.popupFieldsMapping;
      if (!layerName || !popupMapping) return propertyName;
      const mappedProperty =
        getNestedProperty(popupMapping, `${layerName}.${propertyName}`) ||
        popupMapping.default[propertyName] ||
        item.humanizedProperty.toUpperCase();
      return mappedProperty;
    }
  }
};
