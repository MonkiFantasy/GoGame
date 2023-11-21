let board=document.getElementById("board");
let context=board.getContext("2d");//棋盘context对象
let blackPlayer=true;
let fallPosition=[[]];//已落子的坐标
const charArr=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S"];//用于棋盘坐标绘制
const BOARD_SIZE=800;//棋盘大小
const BORDER_SIZE=700;//棋盘边框大小
const WHITE=0;//白棋
const BLACK=1;//黑棋
const EMPTY=2;//空棋
const HOVER=3;//悬停棋
board.width=BOARD_SIZE;
board.height=BOARD_SIZE;






//绘制棋盘
let drawBoard=function(){
    //绘制边框
    context.translate(BOARD_SIZE/2,BOARD_SIZE/2);
    context.beginPath();
    context.rect(-BORDER_SIZE/2,-BORDER_SIZE/2,BORDER_SIZE,BORDER_SIZE);
    context.stroke();
    //绘制横线
    for(let i=0;i<19;i++){
        context.beginPath();
        context.moveTo(-BORDER_SIZE/2,-BORDER_SIZE/2+i*BORDER_SIZE/18);
        context.lineTo(BORDER_SIZE/2,-BORDER_SIZE/2+i*BORDER_SIZE/18);
        context.stroke();
    }
    //绘制竖线
    for(let i=0;i<19;i++){
        context.beginPath();
        context.moveTo(-BORDER_SIZE/2+i*BORDER_SIZE/18,-BORDER_SIZE/2);
        context.lineTo(-BORDER_SIZE/2+i*BORDER_SIZE/18,BORDER_SIZE/2);
        context.stroke();
    }
    //绘制坐标
    for (let i=1;i<=19;i++){
        context.font="20px Arial";
        context.textAlign="center";
        context.textBaseline="hanging";
        context.fillText(i,-BORDER_SIZE/2+(i-1)*BORDER_SIZE/18,-BORDER_SIZE/2-20);
        context.fillText(charArr[i-1],-BORDER_SIZE/2-20,-BORDER_SIZE/2+(i-1)*BORDER_SIZE/18);
    }
    //绘制星位
    let starArr=[[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]];
    for(let i=0;i<starArr.length;i++){
        context.beginPath();
        context.arc(-BORDER_SIZE/2+starArr[i][0]*BORDER_SIZE/18,-BORDER_SIZE/2+starArr[i][1]*BORDER_SIZE/18,5,0,2*Math.PI);
        context.fill();
    }
    context.save();
    context.translate(-BOARD_SIZE/2,-BOARD_SIZE/2);
}

//获得棋子坐标
let getPositions = function () {
    //左上角坐标位置
    startPosition=[(BOARD_SIZE-BORDER_SIZE)/2,(BOARD_SIZE-BORDER_SIZE)/2];
    //361个坐标位置存入二维数组
    let positions = [];
    for (let i = 0; i < 19; i++) {
        positions[i] = [];
        for (let j = 0; j < 19; j++) {
            positions[i][j] = {
                x: startPosition[0] + j * BORDER_SIZE / 18,
                y: startPosition[1] + i * BORDER_SIZE / 18,
                width: BORDER_SIZE / 18,
                height: BORDER_SIZE / 18
            };
        }
    }

    return positions;

}


//获得交叉点附近坐标范围
let getRange = function () {
    positions = getPositions();
    let range = [];
    for (let i = 0; i < positions.length; i++) {
        range[i] = [];
        for (let j = 0; j < positions[i].length; j++) {
            range[i][j]={
                xStart:positions[i][j].x-BORDER_SIZE/36,
                xEnd:positions[i][j].x+BORDER_SIZE/36,
                yStart:positions[i][j].y-BORDER_SIZE/36,
                yEnd:positions[i][j].y+BORDER_SIZE/36
            }
        }
    }
    return range;
}

//画棋子
let drawChess=function (x,y,color) {

    context.beginPath();
    context.arc(x,y,BORDER_SIZE/36-2,0,2*Math.PI);
    let cellSize = BORDER_SIZE / 18;
    let gradient = context.createRadialGradient(0, 0, cellSize, -cellSize * 0.1, -cellSize * 0.1, cellSize * 0.8);
    if (color==WHITE) {
        context.strokeStyle = "#DDDDDD";
        gradient.addColorStop(0, "#B0B0B0");
        gradient.addColorStop(1, "#DDDDDD");
    } else if (color == BLACK) {
        context.strokeStyle = "#222222";
        gradient.addColorStop(0, "#222222");
        gradient.addColorStop(1, "#333333");
    }
    context.fillStyle = gradient;
    context.fill();

}

//移动鼠标事件监听
board.onmousemove=function(event){
    let inBorder = event.clientX>(BOARD_SIZE-BORDER_SIZE)/2&&event.clientX<(BOARD_SIZE+BORDER_SIZE)/2&&event.clientY>(BOARD_SIZE-BORDER_SIZE)/2&&event.clientY<(BOARD_SIZE+BORDER_SIZE)/2;

    for(let i=0;i<range.length;i++){
        for(let j=0;j<range[i].length;j++){
            let inPosition=event.clientX>range[i][j].xStart&&event.clientX<range[i][j].xEnd&&event.clientY>range[i][j].yStart&&event.clientY<range[i][j].yEnd;
            if(inPosition){
                if(blackPlayer) {
                    if (fallPosition[i][j] == EMPTY){
                        drawChess(positions[i][j].x, positions[i][j].y, BLACK);
                        fallPosition[i][j]=3;
                    }
                }else {
                    if (fallPosition[i][j] == EMPTY){
                    drawChess(positions[i][j].x, positions[i][j].y, WHITE);fallPosition[i][j]=3;
                    }

                }
            }else if (!inPosition&&inBorder&&fallPosition[i][j]==3) {
                let radius = BORDER_SIZE / 36 - 2;
                context.clearRect(positions[i][j].x - radius-1, positions[i][j].y - radius-1, radius * 2+2, radius * 2+2);

            }
        }
    }
}
//点击鼠标事件监听
board.onclick=function(event){
    console.log(event.clientX,event.clientY);
    let range=getRange();
    console.log(range);
    //
    for(let i=0;i<range.length;i++){
        for(let j=0;j<range[i].length;j++){
            if(event.clientX>range[i][j].xStart&&event.clientX<range[i][j].xEnd&&event.clientY>range[i][j].yStart&&event.clientY<range[i][j].yEnd){

                if(blackPlayer) {

                    if (fallPosition[i][j] == 3) {
                        drawChess(positions[i][j].x, positions[i][j].y, BLACK);
                    fallPosition[i][j]=BLACK;
                    blackPlayer = !blackPlayer;}
                }else {

                    if (fallPosition[i][j] == 3){

                        drawChess(positions[i][j].x, positions[i][j].y, WHITE);
                    fallPosition[i][j]=WHITE;
                    blackPlayer = !blackPlayer;}
                }
            }
        }
    }

    console.log(fallPosition);
}
//已落子坐标初始化
let initFallPosition=function() {
    for (let i = 0; i < 19; i++) {
        fallPosition[i] = [];
        for (let j = 0; j < 19; j++) {
            fallPosition[i][j] = "EMPTY";
        }
    }
}
drawBoard();
initFallPosition();
let positions=getPositions();
let range = getRange();
/*console.log(positions);
console.log(range);
console.log(positions[0][0].x,positions[0][0].y);
drawChess(positions[15][6].x,positions[15][6].y,WHITE);*/
