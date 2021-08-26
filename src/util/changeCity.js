import city from 'config/city';
//将JSON格式的数据转换成级联选择器的数据格式
export const changeJSONToCity = (cityData=[])=>{
    let arr = [];
    let data = cityData.length > 0 ? cityData : city;
    arr =  data.map((item) => {
        let obj = {
            value: item.c,
            label: item.n,
            children: [],
        };
        obj.children =
            item.r &&
            item.r.map((i) => {
                let childObj = {
                    value: i.c,
                    label: i.n,
                    children: [],
                };
                childObj.children =
                    i.r &&
                    i.r.map((obj) => {
                        let districtObj = {
                            value: obj.c,
                            label: obj.n,
                            children: [],
                        };
                        districtObj.children =
                            obj.r &&
                            obj.r.map((street) => {
                                let streetObj = {
                                    value: street.c,
                                    label: street.n,
                                };
                                return streetObj;
                            });
                        return districtObj;
                    });
                return childObj;
            });
        return obj;
    });
    return arr
}