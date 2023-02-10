
export default class Renderable {
    constructor(public x, public y, public w, public h, public color,
        public startIndex, public amountOfVertices, public angle = 0) //
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.startIndex = startIndex;
        this.amountOfVertices = amountOfVertices;
        this.angle = angle;
    }
}
