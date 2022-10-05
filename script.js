
const boardTable = document.getElementById("boardTable")
const SIZE = 5
var whiteTurn = true;

resetBoard();

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
    boardTable.innerHTML = ""
    for (var i=0;i<SIZE;i++){
        // boardTable.innerHTML += `<div class="row">`
        for (var j=0;j<SIZE;j++){
            boardTable.innerHTML += `<button class="cell" r=${i} c=${j} onclick="clickCell(this)" onmouseenter="previewCell(this)" onmouseleave="noPreviewCell(this)"></button>`
        }
        // boardTable.innerHTML += "</div>"
    }
}

function previewCell(cell){
    // console.log('pw')
    if (whiteTurn) {
        var color = "#eeeeee"
    } else {
        var color = "#363636"
    }
    cell.innerHTML = `<svg height="100" width="100">
    <circle cx="50%" cy="50%" r="45" stroke="${color}" stroke-width="3" fill="${color}" /></svg>`;
    // whiteTurn = !whiteTurn;
    // cell.disabled = true;
}

function noPreviewCell(cell){
    // console.log('noPreviewCell')
    cell.innerHTML = "";
}

function clickCell(cell){
    console.log('click',getCoord(cell))
    if (whiteTurn) {
        var color = "#eeeeee"
    } else {
        var color = "#363636"
    }
    cell.innerHTML = `<svg height="100" width="100">
    <circle cx="50%" cy="50%" r="45" stroke="${color}" stroke-width="3" fill="${color}" /></svg>`;
    whiteTurn = !whiteTurn;
    cell.disabled = true;
}

function getCoord(cell) {
    return [cell.getAttribute("r"),cell.getAttribute("c")]
}
function getRowIdx(cell){
    return cell.getAttribute("r")
}

function getColIdx(cell){
    return cell.getAttribute("c")
}