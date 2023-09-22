
import request from '@/service/request';


  export async function getTopo(data) {
    return request(
      {
        url: '/api/topo/getTopo',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }

  export async function updateTopo(data) {
    return request(
      {
        url: '/api/topo/updateTopo',
        method: 'POST',
        data
      }
    );
  }
  

  export async function getBindList(data) {
    return request(
      {
        url: '/api/topo/bindList',
        method: 'GET',
        params: {
            ...data
          },
      }
    );
  }

  export async function bind(data) {
    return request(
      {
        url: '/api/topo/bind',
        method: 'POST',
        params: {
          ...data
        },
      }
    );
  }
  

  


  