JSON.parseStyle = function (style) {
    let tmp = style.split(';');
    let obj = {};

    for (let a = 0; a < tmp.length; a++) {
        let cssVal = tmp[a].split(':');

        if(cssVal.length > 1){
            obj[cssVal[0].trim()] = cssVal[1].trim();
        }

    }
    return obj;
}