/* eslint-disable no-param-reassign */
import _ from 'lodash';
/**
 * 混入属性或方法到目标对象的原型
 * @param {array | object} sups
 */
export const mixins = function (sups) {
  return function (target) {
    sups = _.isArray(sups) ? sups : [sups];
    sups.forEach(item => {
      const keys = Object.keys(item);
      keys.forEach(key => {
        if (!_.has(target.prototype, key)) {
          target.prototype[key] = item[key];
        }
      });
    });
  };
};
