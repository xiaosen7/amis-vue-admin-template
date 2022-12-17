import Mock from 'mockjs';
import qs from 'query-string';

interface MockFnOptions<Params = any> extends Mock.MockjsRequestOptions {
  params: Params;
  decodedUrl: string;
}

/**
 * 对mockjs的mock函数进行封装，使得mockjs响应时打印控制台信息，对mock函数的参数新增一些属性如params
 * @param url
 * @param method
 * @param template
 * @returns
 */
export const mock = <Params = any>(
  url: string | RegExp,
  method: string,
  template: (options: MockFnOptions<Params>) => any,
) => {
  const newTemplate: Mock.templateOrFn = (options) => {
    const params = qs.parse(options.url.split('?')[1]) as Params;

    const advancedOptions: MockFnOptions<Params> = {
      ...options,
      params,
      decodedUrl: decodeURIComponent(options.url),
    };

    let mockResult = null;
    if (typeof template === 'function') {
      try {
        // mock函数执行
        mockResult = template(advancedOptions);
        if (mockResult && typeof mockResult !== 'object') {
          throw new Error('mock函数的执行结果必须是对象！');
        }
      } catch (e) {
        console.error(e);
      }
    }

    console.log(`%c Mock`, 'background:#000;color:#fff', advancedOptions.decodedUrl, {
      options: advancedOptions,
      mockResult,
    });

    return mockResult;
  };

  return Mock.mock(url, method, newTemplate);
};

export function toAmisSuccessesRes<T>(value: any[] | object) {
  return {
    code: 0,
    data: Array.isArray(value)
      ? {
          rows: value,
          total: value.length,
        }
      : value,
    msg: '成功',
  };
}
