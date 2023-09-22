import { isNotExist } from './utils';

interface storageData {
  value: unknown;
  writeTime: number;
  expired?: number;
}
class LocalStorage {
  private static instance: LocalStorage;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }
    return this.instance;
  }

  public get(key: string) {
    const dataJSON = localStorage.getItem(key);
    // 当目标不存在时直接结束
    if (isNotExist(dataJSON)) {
      return null;
    }
    try {
      const data = dataJSON ? JSON.parse(dataJSON) : {};
      // 当数据的存在周期未定义时，它被认为是永久的
      if (isNotExist(data.expired)) {
        return data.value;
      }
      // 数据声明期结束时释放数据
      if (this.isExpired(data)) {
        this.del(key);
        return null;
      }
      return data.value;
    } catch (e) {
      return null;
    }
  }

  public set(key: string, value: unknown, expired?: number) {
    const data: storageData = {
      value,
      writeTime: Number(new Date()), // 写入时间
      expired,
    };
    // 值是数组，不能直接存储，需要转换 JSON.stringify
    localStorage.setItem(key, JSON.stringify(data));
  }

  public del(key: string) {
    localStorage.removeItem(key);
  }

  // 判读是否过期
  private isExpired(value: storageData) {
    if (!value.value) {
      return true;
    }
    const readTime = Number(new Date());
    return value.expired ? readTime - value.writeTime > value.expired : false;
  }
}

const superStorage = LocalStorage.getInstance();
export const useStorage = (): any => ({
  superStorage
});