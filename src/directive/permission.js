export default {
    mounted(el,bindling){
      let perVal = bindling.value;
      if(bindling.value){
        //todo   from api
        let pers=['add','delete'];
        //hasPer为true为有权限
        //hasPer为false为无权限
        let hasPer = pers.some(item=>{
          return item === perVal
        });
        if(!hasPer){
          el.style.display="none"
        }
      }
    }
  }