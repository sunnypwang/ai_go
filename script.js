
const boardTable = document.getElementById("boardTable")
const debugDiv = document.getElementById("debug")
const debugPrevDiv = document.getElementById("debugPrev")
const SIZE = 5
const C_EMPTY = 0
const C_BLACK = 1
const C_WHITE = 2
const COLORHEX = ["#ff0000","#363636","#eeeeee"]
var boardState;
var boardStatePrev;
var blackTurn = true;
var lastMove = null;

resetBoard();
// drawBoard();

// const cells = document.getElementsByClassName("cell")
// for (var i=0;i<cells.length;i++){
//     var c = cells[i]
//     c.addEventListener("mouseover", () => {
//         console.log(c)
//     //     if (whiteTurn) {
//     //         var color = "#eeeeee"
//     //     } else {
//     //         var color = "#363636"
//     //     }
//     //     c.innerHTML = `<svg height="100" width="100">
//     //     <circle cx="45%" cy="50%" r="40" stroke="${color}" stroke-width="3" fill="${color}" /></svg>`;
//     })
// }

function resetBoard() { 
    console.log('resetBoard')
    boardState = getEmptyBoard();
    // console.log(boardState)
    drawBoard();
}

function getEmptyBoard(){
    board = new Array(5);
    for(var i=0;i<board.length;i++){
        board[i] = new Array(5);
        for (var j=0;j<board.length;j++){
            board[i][j] = 0;
        }
    }
    return board
}

function updateBoard(i,j,color) {
    console.log('update',i,j,color);
    boardStatePrev = deepCopy(boardState);
    boardState[i][j] = color;
    lastMove = [parseInt(i), parseInt(j)];
    captured = getCaptured(boardState, swapColor(color));
    if (captured.length > 0){
        removeStones(boardState, captured)
    }
    debugDiv.innerHTML = lastMove + "<br>" + boardState
    debugPrevDiv.innerHTML = boardStatePrev
    drawBoard();
}

function checkValidMove(i,j,color){
    if (i < 0 || i >= SIZE || j <0 || j >= SIZE || boardState[i][j] != C_EMPTY){
        return false
    }
    tmp = deepCopy(boardState);
    tmp[i][j] = color;

    if (hasLiberty(tmp,i,j)) {
        return true;
    }

    captured = getCaptured(tmp, swapColor(color))
    if (captured.length > 0){
        removeStones(tmp, captured)
        if (equality(tmp,boardStatePrev)){
            console.log('KO Rule')
            return false;
        } else return true;
    }

    return false;
}

function hasLiberty(board, i, j){
    var stack = [[i,j]];
    var explored = getEmptyBoard();
    while (stack.length > 0) {
        var top = stack.pop();
        var top_i = top[0];
        var top_j = top[1];
        explored[top[0]][top[1]] = 1;
        var adj_empty = getAdjStones(board, top_i, top_j, C_EMPTY);
        if (adj_empty.length > 0){
            return true;
        } else {
            var adj_color = getAdjStones(board, top_i, top_j, board[top_i][top_j]);
            for (var k=0;k<adj_color.length;k++){
                var coord = adj_color[k]
                if (!explored[coord[0]][coord[1]]) // not yet explored cell
                    stack.push(coord)
            }
        }
    }
    return false
}

function getAdjStones(board, i, j, color){
    var i = parseInt(i)
    var j = parseInt(j)
    var adj = [];
    if (i > 0 && board[i-1][j] == color)
        adj.push([i-1,j])
    if (j > 0 && board[i][j-1] == color)
        adj.push([i,j-1])
    if (i+1 < board.length && board[i+1][j] == color)
        adj.push([i+1,j])
    if (j+1 < board.length && board[i][j+1] == color)
        adj.push([i,j+1])
    return adj
}

function getCaptured(board, color){
    captured = []
    for (var i=0;i<board.length;i++){
        for (var j=0;j<board.length;j++){
                if (board[i][j] == color && !hasLiberty(board, i, j))
                    captured.push([i,j])
        }
    }
    return captured
}

function removeStones(board, stones){
    for(var k=0;k<stones.length;k++){
        // console.log(stones)
        board[stones[k][0]][stones[k][1]] = C_EMPTY
    }
}

function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
}

function drawBoard(){ // redraw whole board
    boardTable.innerHTML = ""
    for (var i=0;i<SIZE;i++){
        // boardTable.innerHTML += `<div class="row">`
        for (var j=0;j<SIZE;j++){
            console.log(lastMove, [i,j])
            var svg = getSVG(getStone(boardState,i,j), opacity=1, marking=equality(lastMove, [i,j]))
            boardTable.innerHTML += `<button class="cell" r=${i} c=${j} onclick="clickCell(this)" onmouseenter="previewCell(this)" onmouseleave="noPreviewCell(this)">
            ${svg}</button>`
        }
        // boardTable.innerHTML += "</div>"
    }
}

function drawUpdateBoard(i,j){ //only update specific cell
    var svg = getSVG(getStone(boardState,i,j))
    var idx = parseInt(i)*5 + parseInt(j)
    boardTable.childNodes[idx].innerHTML = svg
}

function getStone(board,i,j){
    return board[i][j]
    // if (boardState[i][j] == C_BLACK){
    //     return "#363636"
    // } else if (boardState[i][j] == C_WHITE){
    //     return "#eeeeee"
    // } else {
    //     return 
    // }
}

function setStone(board,i,j,color){
    board[i][j] = color;
}

function getSVG(color, opacity=1, marking=false){
    if (color == C_EMPTY){
        return ""
    } else {
        // var colorhex = COLORHEX[color]
        var svg = `<svg height="100%" width="100%"><circle cx="50%" cy="50%" r="45" stroke="${COLORHEX[color]}" stroke-width="3" fill="${COLORHEX[color]}" opacity="${opacity}"/>`
        if (marking){
            svg += `<circle cx="50%" cy="50%" r="10" stroke="${COLORHEX[swapColor(color)]}" stroke-width="3" fill="${COLORHEX[swapColor(color)]}" opacity="${opacity}"/>`
        }
        svg += `</svg>`
        return svg
    }

}

function previewCell(cell){
    var coord = getCoord(cell);
    var color = (blackTurn) ? C_BLACK : C_WHITE;
    var isValid = checkValidMove(coord[0],coord[1],color);
    if (isValid){
        
        cell.innerHTML = getSVG(color, 0.4);
    }
    console.log(isValid)
}

function noPreviewCell(cell){
    var coord = getCoord(cell);
    if (boardState[coord[0]][coord[1]] == C_EMPTY){
        cell.innerHTML = "";
    }

}

function clickCell(cell){
    var coord = getCoord(cell);
    var color = (blackTurn) ? C_BLACK : C_WHITE;
    var isValid = checkValidMove(coord[0],coord[1],color);
    if (isValid){
        // console.log('click',coord)
        updateBoard(coord[0],coord[1],color)
        blackTurn = !blackTurn;
        cell.disabled = true;
    }

}

function getCoord(cell) {
    return [cell.getAttribute("r"),cell.getAttribute("c")]
}

function getRowIdx(cell){
    return parseInt(cell.getAttribute("r"))
}

function getColIdx(cell){
    return parseInt(cell.getAttribute("c"))
}

function printBoard(board){
    log = ""
    for (var i=0;i<board.length;i++){
        log += board[i].join(" ") + "\n";
    }
    console.log(log)
}

function swapColor(color){
    return 3 - color;
}

function equality(b1,b2){
    if (!b1 || !b2) return false;
    return b1.toString() == b2.toString()
}