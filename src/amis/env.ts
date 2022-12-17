/**
 * amis运行时环境
 */

import { alert, confirm, toast } from "amis";

import axios from "axios";
import copy from "copy-to-clipboard";

/**
 * @reference https://aisuda.bce.baidu.com/amis/zh-CN/docs/extend/debug
 */
if (__APP_DEV__) {
  (window as any).enableAMISDebug = true;
}

/**
 * @reference https://github.com/aisuda/amis-react-starter/blob/main/src/App.tsx
 */
export const env = {
  /**
   * @reference https://aisuda.bce.baidu.com/amis/zh-CN/docs/extend/debug
   */
  enableAMISDebug: !!__APP_DEV__,
  // 下面三个接口必须实现
  fetcher: ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers, // 请求头
  }) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new axios.CancelToken(config.cancelExecutor);
    }

    config.headers = headers || {};

    if (method !== "post" && method !== "put" && method !== "patch") {
      if (data) {
        config.params = data;
      }
      return axios[method](url, config);
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (
      data &&
      typeof data !== "string" &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return axios[method](url, data, config);
  },
  isCancel: (value) => axios.isCancel(value),
  copy: (content) => {
    copy(content);
    toast.success("内容已复制到粘贴板");
  },

  // 后面这些接口可以不用实现

  notify: (type, msg) => {
    toast[type]
      ? toast[type](msg, type === "error" ? "系统错误" : "系统消息")
      : console.warn("[Notify]", type, msg);
  },
  alert,
  confirm,
};
