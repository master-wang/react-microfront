import _ from 'lodash';
import { action, extendObservable } from 'mobx';
import { message } from 'antd';
import { Pagination } from 'src/modules/dataCollection/util/antdTable';
import { mixins } from './core';

/**
 * 生成默认action
 * @param {object} defaults
 */
function genDefaultActions(defaults) {
  return {
    /**
     * 根据默认值初始化状态
     */
    init() {
      extendObservable(this, defaults);
    },
    /**
       * 状态更新
       * 1.传入的参数为对象: object
       * 2.传入的参数为数组：[string, string, object, object]
       */
    update: action(function (payload) {
      let obj = {};
      let arr = [];
      if (_.isArray(payload)) {
        payload.forEach(item => {
          if (_.isString(item)) {
            arr.push(item);
          } else if (_.isObject(item)) {
            obj = { ...obj, ...item };
          }
        });
      } else if (_.isObject(payload)) {
        obj = { ...payload };
      }

      if (!_.isEmpty(obj)) {
        const keys = Object.keys(obj).filter(key => _.has(this, key));
        keys.forEach(key => {
          this[key] = obj[key];
        });
      }

      if (!_.isEmpty(arr)) {
        arr = arr.filter(key => _.has(this, key));
        arr.forEach(key => {
          this[key] = defaults[key];
        });
      }
    }),
    /**
     * 状态重置
     * 1.当传入参数为字符串或字符串数组时，只对传入属性进行状态重置
     * 2.默认重置所有状态
     */
    reset: action(function (payload) {
      const keys = (_.isString(payload)
        ? [payload]
        : _.isArray(payload)
          ? payload
          : []
      ).filter(item => _.isString(item) && _.has(defaults, item));
      if (_.isEmpty(keys)) {
        Object.assign(this, _.cloneDeep(defaults));
      } else {
        keys.forEach(key => {
          this[key] = defaults[key];
        });
      }
    })
  };
}

/**
 * 根据配置动态生成action
 * @param {object} config
 * {
 *  caller: 对应api模块
 *  items: [
 *    {
 *      key: store中对应的方法名
 *      callee: api模块下的方法名，若和key相同，可省略
 *      caller: 一般不设置，默认使用config中的caller, 若设置，优先级高于config中的caller
 *      return: 若设置为true，直接返回后台数据
 *      map: 如果需要将返回数据更新到store，需要用到。map: 后端返回数据与store中的属性对应关系
 *    }
 *  ]
 * }
 */
function genConfigActions(config = {}) {
  const res = {};
  const { items = [] } = config;
  items.forEach(item => {
    if (item.key === 'queryPaging') {
      /**
       * 分页查询
       */
      res[item.key] = async function ({ query, sorter, pagination } = {}) {
        this.update({
          loading: true,
          query: { ...this.query, ...query },
          sorter: { ...this.sorter, ...sorter },
          pagination: { ...this.pagination, ...pagination }
        });
        try {
          const data = await (item.caller
             || config.caller)[item.callee || item.key]({
            page: this.pagination.current,
            pageSize: this.pagination.pageSize,
            sort: _.isEmpty(this.sorter) ? null : {
              orders: [{
                property: this.sorter.field,
                direction: this.sorter.order === 'ascend' ? 'ASC' : 'DESC'
              }]
            },
            ...this.query
          });
          this.update({
            loading: false,
            pagination: {
              ...this.pagination,
              total: _.get(data, 'total') || 0
            },
            dataSource: _.get(data, 'list') || []
          });
        } catch (err) {
          err && message.error(err.message);
          this.update({ loading: false });
        }
      };
    } else {
      /**
       * params: 后台接口需要的参数
       * done: 接口请求成功的回调函数
       * fail: 接口请求失败的回调函数
       */
      res[item.key] = async function (params, done, fail) {
        try {
          const data = await (item.caller
             || config.caller)[item.callee || item.key](params);
          // 直接返回结果
          if (item.return) {
            return data;
          }
          if (typeof data === 'undefined' || data === null) {
            return;
          }
          // 需要将返回数据更新到store，map: 前后端字段映射
          if (!_.isEmpty(item.map)) {
            const payload = {};
            Object.keys(item.map).forEach(key => {
              if (item.map[key] === 'data') {
                payload[key] = data;
              } else {
                payload[key] = _.get(data, item.map[key]);
              }
            });
            this.update(payload);
          }
          done && done(data);
          if (item.successTip) {
            message.success(item.successTip);
          }
        } catch (err) {
          if (item.showError !== false) {
            err && message.error(err.message);
          }
          fail && fail(err);
        }
      };
    }
  });
  return res;
}

/**
 * 混入通用属性和方法
 * @param {object} defaults: 默认的可观察状态
 * @param {object} actions: 需要动态生成的action配置
 */
export function merge(defaults, actions) {
  return function (target) {
    mixins({
      ...genDefaultActions(defaults),
      ...genConfigActions(actions)
    })(target);
  };
}

/**
 * 混入表格通用属性和方法
 * @param {object} defaults: 默认的可观察状态
 * @param {object} actions: 需要动态生成的action配置
 */
export function tableMerge(defaults, actions) {
  const mydefaults = {
    dataSource: [],
    query: {},
    pagination: new Pagination(),
    ...defaults
  };
  return merge(mydefaults, actions);
}
