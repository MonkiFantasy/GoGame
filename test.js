let space = document.getElementsByClassName("space");
let btn = document.getElementById("btn");

for (let i = 0; i < space.length; i++) {
    space[i].state = "outBoard";

    space[i].addEventListener("mouseover", function () {
        if (space[i].state === "outBoard") {
            let chessPiece = document.createElement("div");
            chessPiece.className = "chess";
            space[i].appendChild(chessPiece);
        }
    });

    space[i].addEventListener("mouseout", function () {
        if (space[i].state === "outBoard") {
            let chessPiece = space[i].querySelector(".chess");
            if (chessPiece) {
                space[i].removeChild(chessPiece);
            }
        }
    });

    space[i].addEventListener("click", function () {
        if (space[i].state === "outBoard") {
            let chessPiece = document.createElement("div");
            chessPiece.className = "chess";
            space[i].appendChild(chessPiece);
            space[i].state = "inBoard";
        }
    });
}


//alert("棋子已删除");

//}else {
  //  alert('棋子未删除');
//}
//if(prompt("重新以第二种方式生成棋子？")=="y"){
let player = true;
btn.onclick = function () {

    alert("势如破竹")
//if(prompt("删除所有棋子吗？")=="y"){
    for(let i of space)
    {
        i.innerHTML="";
    }
    for(let j of space){
        let chess=document.createElement("div");
        //chess.className='chess';

        chess.setAttribute("class","chess");
        //chess.setAttribute("style","background:white;");
        chess.style.background=(player==true?"white":"black");
        j.appendChild(chess);
    }player=!player;
}



//}