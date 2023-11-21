let arr=[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
arr.name="zhangsan";
arr.forEach(function t(item,index){
    console.log("item:"+item+" index:"+index);
});
arr.forEach((item,index)=>{
    console.log("item:"+item+" index:"+index);
});
for(let index in arr){
    console.log("item:"+arr[index]+" index:"+index);
}
for(let item of arr){
    console.log("item:"+item);
}
let map=new Map([["name","zhangsan"],["age",18]]);
for(let [key,value] of map){
    console.log("key:"+key+" value:"+value);
}
function abs(x){
    return x>0?x:-x;
}
var abs=function(x){
    
    if(typeof x!=="number"){
        throw "Not a number";
    }
    return x>0?x:-x;
}
console.log(abs(4536261));