let username = document.getElementById("username");
let check1 = document.getElementById("boy");
let check2 = document.getElementById("girl");
let btn = document.getElementById("btn");
let information = function(){
    alert(1);
    alert(username.value+(check1.checked?"boy":"girl"));
}

