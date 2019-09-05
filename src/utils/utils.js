export const getObjDepth = (object) => {
    let level = 1;
    let key;
    for(key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if(typeof object[key] == 'object'){
            level = Math.max(getObjDepth(object[key]) + 1, level);
        }
    }
    return level;
};