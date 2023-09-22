import { defineStore } from 'pinia';

export const configJsplumb = defineStore({
    id: 'configJsplumb', // id必填，且需要唯一
    state: () => {
        return {
            jslumbSortData: [],
            isEdit:false,
            dragedData:[],
            bindId:''
        };
    },
    actions: {
        //拿到数据就插入，假如大家要做一些插入的时候，判断是否重复就可以在这里做
        updateSortData(name) {
            this.jslumbSortData.unshift(name);
        },
        updateDraged(data){
            this.dragedData=data
        },
        updateBindId(id){
            this.bindId=id
        }

    },
});
