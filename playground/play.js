// var tmp = "16/10/2018";
// var cc = tmp.split("/").reverse().join('-');

// var msec = Date.parse(cc);
// var d = new Date(msec);
// console.log( typeof d);
// dd = cc.split("-").reverse().join('/');
// console.log( typeof dd);
function fc(value) {
    var str = value.replace(/,/g, '');
    return parseFloat(str);
}

console.log( typeof fc('100,000,000'));
