import axios from "axios";

import { ElMessage } from "element-plus";
import { useStorage } from '@/hooks/localStorage';
import {
  API_OK, API_EXPIRE, TIMEOUT, API
} from '@/constants/api';


const { superStorage } = useStorage();



const service = axios.create({
  baseURL: '/',
  timeout: TIMEOUT, // request timeout
});

service.interceptors.request.use((config) => {
  const configT = config;
  const { headers } = config;
  configT.headers = {
    "Content-Type": "application/json;charset=utf-8",
    ...headers,
  };
  const token = superStorage.get("token");
  if (token) {
    configT.headers.Authorization = `Bearer ${token}`;
  }
  return configT;
});

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // if (res.code !== API_OK) {
    //   if (res.code === API_EXPIRE) {
    //     router.replace("/login");
    //     return Promise.reject(new Error("登录状态已过期，请重新登录"));
    //   }
    //   return Promise.reject(new Error(res.msg || "请求失败"));
    // }
    return res?.data;
  },
  (error) => Promise.reject(error)
);

const request = (params, dealErr = false) =>
  new Promise((resolve, reject) => {
    service(params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err.message);
        if (dealErr) {
          reject(err);
        } else {
          ElMessage({
            message: err.message,
            type: "error",
          });
        }
      });
  });

export default request;
