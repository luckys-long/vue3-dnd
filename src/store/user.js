import {defineStore} from 'pinia'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {
          name:'admin'
        } ,
      }),
      getters: {},
      actions:{

      },
});


