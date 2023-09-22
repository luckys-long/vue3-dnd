import { cloneDeep, throttle } from "lodash";
import sha256 from "crypto-js/sha256";
import md5 from "crypto-js/md5";

export const useSha256 = (binaryString) => sha256(binaryString).toString();
export const useCMd5 = (binaryString) => md5(binaryString).toString();
export const useDeepClone = () => cloneDeep;
export const useThrottle = () => throttle;

/**
 * @description: 生成uuid
 * @return {string}
 */
export function uuidGenerate() {
  let uuid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    uuid += n;
    if (i == 8 || i == 12 || i == 16 || i == 20) uuid += "-";
  }
  return uuid;
}

export const TYPE_MAP = {
  string: "[object String]",
  number: "[object Number]",
  boolean: "[object Boolean]",
  null: "[object Null]",
  undefined: "[object Undefined]",
  object: "[object Object]",
  array: "[object Array]",
  function: "[object Function]",
  symbol: "[object Symbol]",
  BLOB: "[object Blob]",
  FILE: "[object File]",
};

export const getTypeString = (tar) => Object.prototype.toString.call(tar);
export const isStr = (tar) => getTypeString(tar) === TYPE_MAP.string;
export const isNum = (tar) => getTypeString(tar) === TYPE_MAP.number;
export const isBoolean = (tar) => getTypeString(tar) === TYPE_MAP.boolean;
export const isNull = (tar) => getTypeString(tar) === TYPE_MAP.null;
export const isUndefined = (tar) => getTypeString(tar) === TYPE_MAP.undefined;
export const isDef = (tar) => getTypeString(tar) !== TYPE_MAP.undefined;
export const isObj = (tar) => getTypeString(tar) === TYPE_MAP.object;
export const isArr = (tar) => getTypeString(tar) === TYPE_MAP.array;
export const isFun = (tar) => getTypeString(tar) === TYPE_MAP.function;
// 检查 {}
export const isEmptyObject = (tar) =>
  Object.keys(tar).length == 0 || JSON.stringify(obj) === "{}";

export const isNotExist = (val) => val === null || typeof val === "undefined";

export const isBlob = (value) => getValueType(value) === TYPE_MAP.BLOB;
export const isFile = (value) => getValueType(value) === TYPE_MAP.FILE;

export const withInstall = (component) => {
  component.install = function (Vue) {
    Vue.component(component.name, component);
  };
  return component;
};
