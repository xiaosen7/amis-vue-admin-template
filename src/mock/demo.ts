import { mock, toAmisSuccessesRes } from './mock-utils';
import Mock from 'mockjs';

// 热点问题

// 热点
mock('/api/demo/hotReceive', 'get', () => {
  return require('./results/demo/hotReceive.json');
});

// 用户反馈表单

// 用户反馈-选择器数据
mock('/api/demo/selector', 'get', () => {
  return require('./results/demo/selector.json');
});

// 用户反馈提交
mock('/api/demo/use-feedback', 'post', () => {
  return require('./results/demo/use-feedback.json');
});

// 问题列表

// 列表
mock(new RegExp('/api/demo/questions'), 'get', () => {
  return require('./results/demo/questions.json');
});

// 更新问题
mock(new RegExp('/api/demo/questions'), 'get', () => {
  return require('./results/demo/questions.json');
});

// 24小时新增
mock(new RegExp('/api/demo/24h-increase'), 'get', () => {
  return require('./results/demo/24h-increase.json');
});

// 城市问题数量
mock(new RegExp('/api/demo/count-by-type'), 'get', () => {
  return require('./results/demo/count-by-type.json');
});

// 更新问题
mock(new RegExp('/api/demo/update-questions'), 'post', () => {
  return require('./results/demo/update-questions.json');
});

// 城市 options
mock(new RegExp('/api/demo/city-options'), 'get', () => {
  let index = 0;
  return toAmisSuccessesRes(
    Mock.mock({
      'rows|20': [
        {
          label: '北京',
          value: () => index++,
          count: '@integer(0, 1000)',
        },
      ],
    }).rows,
  );
});
