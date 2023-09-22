//
export interface logListType {
  deviceName: string; // 设备名称
  nodeId: string; //  id
  onlineStatus: string; // 状态
  path: string; // 路径
}

export interface logManageListType {
  deviceName: string;
  nodeId: string;
  path: string;
  onlineStatus: string;
}

export interface nodeDetailType {
  nodeName: string;
  nodeParent: string;
  nodeIp: string;
  nodeSuggest: object;
  nodeStatus: number;
  flag: boolean;
}
