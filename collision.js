class Rectangle {
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    contains(x, y) {
        return this.x <= x && this.x + this.width >= x &&
               this.y <= y && this.y + this.height >= y;
    }

    move(x, y) {
        return new Rectangle(this.x+x, this.y+y, this.width, this.height);
    }

    drawRect(ctx) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
        
    }
}