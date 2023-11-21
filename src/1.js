let canvas = document.getElementById("board");
let context = canvas.getContext("2d");
canvas.width=9999;
canvas.height=9999;

// 绘制一个红色矩形
context.fillStyle = "red";
context.fillRect(50, 50, 100, 100);
let data = context.getImageData(50,50,50,50);
context.fillStyle="black";
context.fillRect(50,50,50,50);
context.putImageData(data,40,40);

