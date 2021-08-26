/*
* 同一对象前后比对,将新对象相同的值置为空null
* oldval为原对象的深拷贝对象
*/
export const diffParams = (oldval, newval, ignoreArr) => {
  if (!(oldval instanceof Object) || !(newval instanceof Object)) return;
  for (let oldindex in oldval) {
    if(!ignoreArr || ignoreArr && ignoreArr.length>0 && !ignoreArr.includes(oldindex)){
    
      if (oldval[oldindex] instanceof Object && !(oldval[oldindex] instanceof Array)) {
        diffParams(oldval[oldindex], newval[oldindex], ignoreArr);
      } else {
        if (oldval[oldindex] instanceof Array) {
          if (JSON.stringify(oldval[oldindex]) == JSON.stringify(newval[oldindex])) {
            newval[oldindex] = null;
          }
        } else {
          if (oldval[oldindex] == newval[oldindex]) {
            newval[oldindex] = null;
          }
        }
      }
    }
  }
}

// 验证类型
export const checkedType = (data) => {
  return Object.prototype.toString.call(data).slice(8, -1);
}

// 对象深拷贝
export const deepCopy = (target) => {
  let result,
    targetType = checkedType(target);
  if (targetType == 'Object') {
    result = {};
  } else if (targetType == 'Array') {
    result = [];
  } else {
    return target; //普通数据类型直接返回
  }

  for (let i in target) {
    let value = target[i];
    if (checkedType(value) == 'Object' || checkedType(value) == 'Array') {
      result[i] = deepCopy(value);
    } else {
      result[i] = value;
    }
  }
  return result;
}
// 判断对象是否有值(修改)
export const ObjectHaveValue = (obj) => {
  let haveValue = false;
  const loop = (obj) => {
    if(checkedType(obj)=='Object'){
      for(let index in obj){
        if(checkedType(obj[index])=='Object'){
          loop(obj[index]);
        }else{
          if( obj[index]!=null){
            haveValue = true;
            break ;
          }
        }
      }
    }
    if(checkedType(obj)=='Array'){
      for(let item of obj){
        if(checkedType(item)=='Object'){
          loop(item)
        }else{
          if(item!=''&& item!=null){
            haveValue = true;
            break;
          }
        }
      }
    }
  }
  loop(obj);
  return haveValue;
}

// 将数组形式转为字符串
export const arrayToString = (datarange) => {
  if(!datarange) return null;
  if(!Array.isArray(datarange)) return datarange;
  return datarange.join(',');
}

// 修改服务中心图片回显
export const echoImagesDeal = (url) => {
  return url ? [{ url: url }] : [];
}

// 将对象置空
export const emptyObject = (obj) => {
  const dealfn = (obj) => {
    for(let index in obj){
      if(checkedType(obj[index])=='Object'){
        dealfn(obj[index]);
      }else if(checkedType(obj[index])=='Array'){
        obj[index] = []
      }else{
        obj[index] = '';
      }
    }
  }
  dealfn(obj);
  return obj;
}

// JSON对象编译
export const jsonString = (data) => {
  if(checkedType(data) == 'String') return data;
  return JSON.stringify(data);
}
// 判断省市区街道至少选中省市区
export const requiredArray = (data) => {
  if(checkedType(data)!='Array') return false;
  const arr = data.filter(item => {
    return item > 0;
  })
  if(arr.length >= 3){
    return true;
  }else{
    return false;
  }
}