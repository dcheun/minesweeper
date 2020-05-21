// Cell
// Each cell in the grid.

class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.mine = false;
    this.revealed = false;
    this.neighborCount = 0;
    if (testMode) {
      this.revealed = true;
    }
  }
  
  show() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.w);
    ctx.closePath();
    ctx.stroke();
    if (this.revealed) {
      if (this.mine) {
        ctx.beginPath();
        ctx.arc(this.x + (this.w * 0.5), this.y + (this.w * 0.5), this.w * 0.3, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgb(128,128,128)";
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.w);
        ctx.closePath();
        ctx.fillStyle = "rgb(200,200,200)";
        ctx.fill();
        ctx.stroke();
        if (this.neighborCount > 0) {
          ctx.textAlign = "center";
          ctx.fillStyle = "rgb(0,0,0)";
          ctx.fillText(this.neighborCount, this.x + (this.w * 0.5), this.y + (this.w * 0.7));
        }
      }
    }
  }
  
  contains(x, y) {
    // Check if mouse pointer was within cell boundary.
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
  }
  
  reveal() {
    this.revealed = true;
    this.show();
    if (this.neighborCount == 0) {
      // Flood fill
      this.floodFill();
    }
  }
  
  floodFill() {
    // Reveal neighboring cells that are not mines.
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        let i = this.i + xoff;
        let j = this.j + yoff;
        if (i > -1 && i < cols && j > -1 && j < rows) {
          let neighbor = grid[i][j]
          if (!neighbor.mine && !neighbor.revealed) {
            neighbor.reveal();
          }
        }
      }
    }
  }
  
  countNeighborMines() {
    if (this.mine) {
      this.neighborCount = -1;
      return;
    }
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        let i = this.i + xoff;
        let j = this.j + yoff;
        if (i > -1 && i < cols && j > -1 && j < rows) {
          let neighbor = grid[i][j]
          if (neighbor.mine) {
            total++;
          }
        }
      }
    }
    this.neighborCount = total;
  }
}


