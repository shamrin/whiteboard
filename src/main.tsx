// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// let Main = React.createClass({
//     render() {
//         return <div>Hello from main.</div>;
//     }
// });

class Canvas {
    segments: Segment[];
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isDrawing: Boolean;
    
    constructor(element) {
        this.segments = [{points: []}];
        this.element = element;
        
        element.onmousedown = this.handleMouseDown;
        element.onmousemove = this.handleMouseMove;
        element.onmouseup = this.handleMouseUp;
        
        this.ctx = element.getContext('2d');
        this.ctx.lineWidth = 10;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
    }
    
    getSegment(): Segment {
        return this.segments[this.segments.length - 1];
    }
    
    handleMouseDown = (e: MouseEvent) => {
        this.isDrawing = true;
        this.getSegment().points.push(getCoords(e, e.currentTarget as HTMLElement));
    }
    
    handleMouseMove = (e: MouseEvent) => {
        if (!this.isDrawing) return;

        this.getSegment().points.push(getCoords(e, e.currentTarget as HTMLElement));
        
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.segments.forEach(segment => drawSegment(this.ctx, segment));
    }
    
    handleMouseUp = (e: MouseEvent) => {
        this.isDrawing = false;
        this.segments.push({points: []});
    }
}

function drawSegment (ctx: CanvasRenderingContext2D, segment: Segment) {
    let [p1, p2] = segment.points;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (var i = 1, len = segment.points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        var midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = segment.points[i];
        p2 = segment.points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
}

function midPointBtw(p1: Point, p2: Point): Point {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

var canvas = new Canvas(document.getElementById('c'));

interface Point {
    x: number;
    y: number;
}

interface Segment {
    points: Point[];
}

function getCoords (event: MouseEvent, element: HTMLElement): Point {
    return {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
    };
}

// ReactDOM.render(<Main />, document.getElementById('main'));
