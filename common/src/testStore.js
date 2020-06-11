import { tableMerge } from '../../decorators/store';
import * as api from '../../service/realTimeSync';
/**
 * 默认状态
 */
const DEFAULTS = {
  detail: 333,
};

/**
 * 可配置ACTION
 */
const ACTIONS = {
  caller: api,
  items: [
    // 分页查询
    { key: 'getChannelDetail', map: { detail: 'data' }, successTip: '查询成功！' },
  ]
};

// 测试装饰器
@tableMerge(DEFAULTS, ACTIONS)
class TestStore { // 数据集成-离线同步数据源store
  constructor() {
    this.init();
  }
}

export default new TestStore();
