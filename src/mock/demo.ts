import { mock, toAmisSuccessesRes } from './mock-utils';
import Mock from 'mockjs';

// 热点问题

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
