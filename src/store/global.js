import {defineStore} from 'pinia'

export const useGlobalStore = defineStore({
    id: 'global',
    state: () => ({
        collapse:false
      }),
      getters: {},
      actions:{
        changeCollapse(collapse) {
            this.collapse = collapse;
          },
      },
});

