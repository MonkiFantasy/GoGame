const charArr=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S"];//用于棋盘坐标绘制
const BOARD_SIZE=800;//棋盘大小
const BORDER_SIZE=700;//棋盘边框大小
const WHITE=0;//白棋
const BLACK=1;//黑棋
const EMPTY=2;//空棋

let board=document.getElementById("board");
let context=board.getContext("2d");//棋盘context对象
let blackPlayer=true;
let fallPosition=[[]];//坐标的落子状态
let isFloat =[[]];//鼠标是否悬浮在坐标上
let air = [[]];
let canvasHistory =[];
let radius = BORDER_SIZE / 36 ;
let data;



board.width=BOARD_SIZE;
board.height=BOARD_SIZE;

//检测棋子的气，存入数组air
/*let checkAir = function(){
    let fp=fallPosition;
    for(let i=0;i<19;i++){
        air[i]=[];
        for (let j = 0;j<19;j++){
            air[i][j]=[];
            if(fallPosition[i][j]!=EMPTY) {//如果有棋子，才判断气


                //先判断角
                if (i == 0 && j == 0) {
                    let d = fp[i + 1][j];
                    let r = fp[i][j + 1];
                    if(d==EMPTY){
                        air[i][j].push('(' + (i + 1) + ',' + j + ')');
                    }
                    if(r==EMPTY){
                        air[i][j].push('(' + i + ',' + (j+1) + ')');
                    }
                } else if (i == 0 && j == 18) {

                } else if (i == 18 && j == 0) {

                } else if (i == 18 && j == 18) {

                } else {
                    //再判断边
                    if (i == 0) {

                    } else if (j == 0) {

                    } else if (i == 18) {

                    } else if (j == 18) {

                    } else {
                        //再判断中腹
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (u == EMPTY) {
                            air[i][j].push('(' + (i - 1) + ',' + j + ')');
                        }
                        if(d==EMPTY){
                            air[i][j].push('(' + (i + 1) + ',' + j + ')');
                        }
                        if(l==EMPTY){
                            air[i][j].push('(' + (i) + ',' + (j-1) + ')');
                        }
                        if(r==EMPTY){
                            air[i][j].push('(' + i + ',' + (j+1) + ')');
                        }

                    }
                }
            }
        }
    }
    console.log(air);
}*/
//同色棋子连接之后更新气
let connectChess = function(){
    let fp = fallPosition;

    // 定义一个辅助函数用于合并气数组并去重
    const mergeAndRemoveDuplicates = (air1, air2) => {
        let mergedAir = [...air1, ...air2];
        return Array.from(new Set(mergedAir));
    };

    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            if (fallPosition[i][j] !== EMPTY) { // 如果有棋子，才进行连接操作
                let currentChessAir = air[i][j];

                // 连接角
                if (i === 0 && j === 0) {
                    let d = fp[i + 1][j];
                    let r = fp[i][j + 1];
                    if (d === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                        air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                    }
                    if (r === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                        air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                    }
                } else if (i === 0 && j === 18) {
                    let d = fp[i + 1][j];
                    let l = fp[i][j - 1];
                    if (d === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                        air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                    }
                    if (l === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                        air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                    }
                } else if (i === 18 && j === 0) {
                    let u = fp[i - 1][j];
                    let r = fp[i][j + 1];
                    if (u === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                        air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                    }
                    if (r === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                        air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                    }
                } else if (i === 18 && j === 18) {
                    let u = fp[i - 1][j];
                    let l = fp[i][j - 1];
                    if (u === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                        air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                    }
                    if (l === fallPosition[i][j]) {
                        air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                        air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                    }
                } else {
                    // 连接边
                    if (i === 0) {
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (d === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                            air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (l === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                            air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (r === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                            air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                        }
                    } else if (j === 0) {
                        // 连接左边的情况
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let r = fp[i][j + 1];
                        if (u === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                            air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (d === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                            air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (r === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                            air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                        }
                    } else if (i === 18) {
                        let u = fp[i - 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (u === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                            air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (l === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                            air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (r === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                            air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                        }
                    } else if (j === 18) {
                        // 连接右边的情况
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        if (u === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                            air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (d === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                            air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (l === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                            air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                        }
                    } else {
                        // 连接中腹
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (u === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i - 1][j]);
                            air[i - 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (d === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i + 1][j]);
                            air[i + 1][j] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (l === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j - 1]);
                            air[i][j - 1] = air[i][j]; // 更新相连的棋子的气
                        }
                        if (r === fallPosition[i][j]) {
                            air[i][j] = mergeAndRemoveDuplicates(currentChessAir, air[i][j + 1]);
                            air[i][j + 1] = air[i][j]; // 更新相连的棋子的气
                        }
                    }
                }
            }
        }
    }
    console.log(air);
}


let checkAir = function(){
    let fp = fallPosition;
    for (let i = 0; i < 19; i++) {
        air[i] = [];
        for (let j = 0; j < 19; j++) {
            air[i][j] = [];
            if (fallPosition[i][j] !== EMPTY) { // 如果有棋子，才判断气

                // 先判断角
                if (i === 0 && j === 0) {
                    let d = fp[i + 1][j];
                    let r = fp[i][j + 1];
                    if (d === EMPTY) {
                        air[i][j].push('(' + (i + 1) + ',' + j + ')');
                    }
                    if (r === EMPTY) {
                        air[i][j].push('(' + i + ',' + (j + 1) + ')');
                    }
                } else if (i === 0 && j === 18) {
                    let d = fp[i + 1][j];
                    let l = fp[i][j - 1];
                    if (d === EMPTY) {
                        air[i][j].push('(' + (i + 1) + ',' + j + ')');
                    }
                    if (l === EMPTY) {
                        air[i][j].push('(' + i + ',' + (j - 1) + ')');
                    }
                } else if (i === 18 && j === 0) {
                    let u = fp[i - 1][j];
                    let r = fp[i][j + 1];
                    if (u === EMPTY) {
                        air[i][j].push('(' + (i - 1) + ',' + j + ')');
                    }
                    if (r === EMPTY) {
                        air[i][j].push('(' + i + ',' + (j + 1) + ')');
                    }
                } else if (i === 18 && j === 18) {
                    let u = fp[i - 1][j];
                    let l = fp[i][j - 1];
                    if (u === EMPTY) {
                        air[i][j].push('(' + (i - 1) + ',' + j + ')');
                    }
                    if (l === EMPTY) {
                        air[i][j].push('(' + i + ',' + (j - 1) + ')');
                    }
                } else {
                    // 再判断边
                    if (i === 0) {
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (d === EMPTY) {
                            air[i][j].push('(' + (i + 1) + ',' + j + ')');
                        }
                        if (l === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j - 1) + ')');
                        }
                        if (r === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j + 1) + ')');
                        }
                    } else if (j === 0) {
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let r = fp[i][j + 1];
                        if (u === EMPTY) {
                            air[i][j].push('(' + (i - 1) + ',' + j + ')');
                        }
                        if (d === EMPTY) {
                            air[i][j].push('(' + (i + 1) + ',' + j + ')');
                        }
                        if (r === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j + 1) + ')');
                        }
                    } else if (i === 18) {
                        let u = fp[i - 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (u === EMPTY) {
                            air[i][j].push('(' + (i - 1) + ',' + j + ')');
                        }
                        if (l === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j - 1) + ')');
                        }
                        if (r === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j + 1) + ')');
                        }
                    } else if (j === 18) {
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        if (u === EMPTY) {
                            air[i][j].push('(' + (i - 1) + ',' + j + ')');
                        }
                        if (d === EMPTY) {
                            air[i][j].push('(' + (i + 1) + ',' + j + ')');
                        }
                        if (l === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j - 1) + ')');
                        }
                    } else {
                        // 再判断中腹
                        let u = fp[i - 1][j];
                        let d = fp[i + 1][j];
                        let l = fp[i][j - 1];
                        let r = fp[i][j + 1];
                        if (u === EMPTY) {
                            air[i][j].push('(' + (i - 1) + ',' + j + ')');
                        }
                        if (d === EMPTY) {
                            air[i][j].push('(' + (i + 1) + ',' + j + ')');
                        }
                        if (l === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j - 1) + ')');
                        }
                        if (r === EMPTY) {
                            air[i][j].push('(' + i + ',' + (j + 1) + ')');
                        }
                    }
                }
            }
        }
    }
    console.log(air);
}

//判死子
let checkDeath= function(color){
    let opColor = (color==WHITE)?BLACK:WHITE;
    for (let i=0;i<19;i++){
        for (let j=0;j<19;j++){
            if(fallPosition[i][j]==opColor&&air[i][j].length==0){
                clearChess(i,j);
                fallPosition[i][j]=EMPTY;
                //air[i][j]=[];//本来就是没气才死，这里没必要
            }
        }
    }
}




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

    context.translate(-BOARD_SIZE/2,-BOARD_SIZE/2);
    data = getRawData();
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
//获取棋子交叉点原画
let getRawData=function (){
    let data = [[]];

    for(let i=0;i<19;i++){
        data[i]=[];

        for(let j=0;j<19;j++) {
            data[i][j] = context.getImageData(positions[i][j].x - radius,positions[i][j].y - radius, radius * 2,radius * 2);
        }
    }
    return data;
};

//清除掉棋子
let clearChess = function (i,j){

    context.clearRect(positions[i][j].x - radius, positions[i][j].y - radius, radius * 2, radius * 2);
    context.putImageData(data[i][j],positions[i][j].x - radius,positions[i][j].y - radius);
}

//检测死子
/*let checkDeath = function (color){
    let opColor;
    if (color==BLACK){
        opColor=WHITE;
    }else {
        opColor=BLACK;
    }
    for (let i = 0; i < 19; i++) {

        for (let j = 0; j < 19; j++) {
            let up,down,left,right;
            if(j!=0){

                up=fallPosition[i][j-1];
            }
            down=fallPosition[i][j+1];
            if(i!=0){

                left=fallPosition[i-1][j];
            }
            right=fallPosition[i+1][j];
            if(i==0||j==0||i==18||j==18){

                if (i==0&&j==0){
                    if (fallPosition[i][j] == color &&down==opColor&&right==opColor){
                        clearChess(i, j);
                        fallPosition[i][j] = EMPTY;
                    }
                }else if(i==18&&j==0){

                }

            }else {
                if (fallPosition[i][j] == color && left == opColor
                    && right == opColor && up == opColor && down == opColor) {
                    clearChess(i, j);
                    fallPosition[i][j] = EMPTY;
                }
            }
        }
    }
}*/


let positions=getPositions();
let range = getRange();
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
                        isFloat[i][j]=true;
                    }
                }else {
                    if (fallPosition[i][j] == EMPTY){

                        drawChess(positions[i][j].x, positions[i][j].y, WHITE);
                        isFloat[i][j]=true;
                    }

                }
            }else if (!inPosition&&inBorder&&isFloat[i][j]==true&&fallPosition[i][j]!=WHITE&&fallPosition[i][j]!=BLACK) {
                clearChess(i,j);

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
                    if (fallPosition[i][j] == EMPTY) {
                        drawChess(positions[i][j].x, positions[i][j].y, BLACK);
                        fallPosition[i][j]=BLACK;
                        /*checkDeath(BLACK);*/
                        checkAir();
                        connectChess();
                        checkDeath(BLACK);
                        blackPlayer = !blackPlayer;

                    }
                }else {
                    if (fallPosition[i][j]== EMPTY){
                        drawChess(positions[i][j].x, positions[i][j].y, WHITE);
                        fallPosition[i][j]=WHITE;
                        /*checkDeath(WHITE);*/
                        checkAir();
                        connectChess();
                        checkDeath(WHITE);
                        blackPlayer = !blackPlayer;

                    }
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
        isFloat[i]=[];
        for (let j = 0; j < 19; j++) {
            fallPosition[i][j] = EMPTY;
            isFloat[i][j]=false;
        }
    }
}
drawBoard();
initFallPosition();

/*console.log(positions);
console.log(range);
console.log(positions[0][0].x,positions[0][0].y);
drawChess(positions[15][6].x,positions[15][6].y,WHITE);*/
