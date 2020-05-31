const filesJson = require("./../static/json/filesJson.json");
const mapsJson = require("./../static/json/map.json");
const BLOCK_WIDTH = 32
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const utils = <HTMLCanvasElement>document.getElementById("mapBlock");
const utilCtx = utils.getContext('2d');
const img: HTMLImageElement = new Image();
let mapBlockData: ImageData, mapUtilData, mapData, blockWidth: number, blockHeight: number, pageIndex = 0, imgNum = filesJson.tilesets.length, modeType = 1;
let mapBlockArr: Array<any> = []
setImg(0)
img.onload = () => {
    utils.width = img.width;
    utils.height = img.height;
    utilCtx.strokeStyle = "#000000";
    utilCtx.textAlign = "center"
    utilCtx.textBaseline = "middle"
    utilCtx.font = "28px Arial"
    utilCtx.drawImage(img, 0, 0)
    mapUtilData = utilCtx.getImageData(0, 0, utils.width, utils.height)
    if (!mapBlockArr) {
        mapBlockArr = []
        for (let i = 0; i < utils.height / BLOCK_WIDTH; i++) {
            mapBlockArr.push(new Array(utils.width / BLOCK_WIDTH).fill(0))
        }
    }
    if (!modeType) {
        setMapJson()
    }
}

function setMapJson() {
    utilCtx.beginPath();
    mapBlockArr.forEach((element, cy) => {
        element.forEach((el, cx) => {
            if (el) {
                utilCtx.rect(cx * BLOCK_WIDTH, cy * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
                utilCtx.fillText('' + mapBlockArr[cy][cx], cx * BLOCK_WIDTH + BLOCK_WIDTH / 2, cy * BLOCK_WIDTH + BLOCK_WIDTH / 2)
            }
        });
    });
    utilCtx.stroke();
}
function setImg(p) {
    mapBlockArr = mapsJson[filesJson.tilesets[p].split('.')[0]]
    img.src = './../static/img/tilesets/' + filesJson.tilesets[p];
}
utils.onmousedown = (e) => {
    let { left, top } = utils.getBoundingClientRect()
    let x = e.clientX - left, y = e.clientY - top;
    getRectBlock(x, y, x, y)
    utils.onmousemove = (e) => {
        let x1 = e.clientX - left, y1 = e.clientY - top;
        getRectBlock(x, y, x1, y1)
    }
    utils.onmouseup = (e) => {
        utils.onmousemove = null
    }
}
document.getElementById('createJson').addEventListener("click", () => {
    console.log(JSON.stringify(mapBlockArr));
})

document.getElementById('prePage').addEventListener("click", () => {
    if (pageIndex > 0) {
        setImg(--pageIndex)
    }
})

document.getElementById('nextPage').addEventListener("click", () => {
    if (pageIndex < imgNum - 1) {
        setImg(++pageIndex)
    }
})
document.getElementById('changeMode').addEventListener("click", () => {
    utilCtx.putImageData(mapUtilData, 0, 0)
    if (modeType) {
        modeType = 0
        utils.onmousedown = null
        setMapJson()
        utils.onmouseup = (e) => {
            let { left, top } = utils.getBoundingClientRect()
            let x = e.clientX - left, y = e.clientY - top;
            let bx = Math.floor(x / BLOCK_WIDTH),
                by = Math.floor(y / BLOCK_WIDTH);
            mapBlockArr[by][bx] = ++mapBlockArr[by][bx] < 3 ? mapBlockArr[by][bx] : 0
            utilCtx.putImageData(mapUtilData, 0, 0)
            setMapJson()
        }
    } else {
        modeType = 1
        utils.onmousedown = (e) => {
            let { left, top } = utils.getBoundingClientRect()
            let x = e.clientX - left, y = e.clientY - top;
            getRectBlock(x, y, x, y)
            utils.onmousemove = (e) => {
                let x1 = e.clientX - left, y1 = e.clientY - top;
                getRectBlock(x, y, x1, y1)
            }
            utils.onmouseup = (e) => {
                utils.onmousemove = null
            }
        }
    }
})
function mousemove() {
    canvas.onmousemove = (e) => {
        let { left, top } = canvas.getBoundingClientRect()
        let x = e.clientX - left, y = e.clientY - top;
        let bx = Math.floor(x / BLOCK_WIDTH) * BLOCK_WIDTH,
            by = Math.floor(y / BLOCK_WIDTH) * BLOCK_WIDTH;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.putImageData(mapData, 0, 0)
        ctx.beginPath();
        ctx.rect(bx, by, blockWidth, blockHeight);
        ctx.stroke()
    }
}
mousemove()
mapData = ctx.getImageData(0, 0, canvas.width, canvas.height)
canvas.onmousedown = (e) => {
    let { left, top } = canvas.getBoundingClientRect()
    let x = e.clientX - left, y = e.clientY - top;
    ctx.putImageData(mapData, 0, 0)
    drawMap(x, y)
    canvas.onmousemove = (e) => {
        let x1 = e.clientX - left, y1 = e.clientY - top;
        drawMap(x1, y1)
    }
    canvas.onmouseup = (e) => {
        mapData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        mousemove()
    }
}
function drawMap(x, y) {
    let bx = Math.floor(x / BLOCK_WIDTH) * BLOCK_WIDTH,
        by = Math.floor(y / BLOCK_WIDTH) * BLOCK_WIDTH;
    let c = document.createElement('canvas');
    c.width = blockWidth;
    c.height = blockHeight;
    let ct = c.getContext('2d');
    ct.putImageData(mapBlockData, 0, 0)
    let image: HTMLImageElement = new Image()
    image.src = c.toDataURL('image/png')
    ctx.drawImage(image, bx, by)
    mapData = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function getRectBlock(x, y, x1, y1) {
    let bx = Math.floor(x / BLOCK_WIDTH) * BLOCK_WIDTH,
        by = Math.floor(y / BLOCK_WIDTH) * BLOCK_WIDTH,
        bx1 = Math.ceil(x1 / BLOCK_WIDTH) * BLOCK_WIDTH,
        by1 = Math.ceil(y1 / BLOCK_WIDTH) * BLOCK_WIDTH;
    utilCtx.putImageData(mapUtilData, 0, 0)
    utilCtx.beginPath();
    utilCtx.rect(bx - 2, by - 2, bx1 - bx + 4, by1 - by + 4);
    utilCtx.stroke();
    blockWidth = bx1 - bx;
    blockHeight = by1 - by;
    mapBlockData = utilCtx.getImageData(bx, by, blockWidth, blockHeight)
}
