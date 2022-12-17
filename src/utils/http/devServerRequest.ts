import axios from "axios";
import { ElMessage } from "element-plus"

export const devServerRequest = axios.create({
  baseURL: "/dev-server",
});

devServerRequest.interceptors.response.use(({data: res}) => {
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
  }

  return res.data
})
