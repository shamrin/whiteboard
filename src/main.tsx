// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// let Main = React.createClass({
//     render() {
//         return <div>Hello from main.</div>;
//     }
// });

class Canvas {
    points: Coords[];
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isDrawing: Boolean;
    
    constructor(element) {
        this.points = [];
        this.element = element;
        
        element.onmousedown = this.handleMouseDown;
        element.onmousemove = this.handleMouseMove;
        element.onmouseup = this.handleMouseUp;
        
        this.ctx = element.getContext('2d');
        this.ctx.lineWidth = 10;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
    }
    
    handleMouseDown = (e: MouseEvent) => {
        this.isDrawing = true;
        this.points.push(getCoords(e, e.currentTarget as HTMLElement));
    }
    
    handleMouseMove = (e: MouseEvent) => {
        if (!this.isDrawing) return;

        this.points.push(getCoords(e, e.currentTarget as HTMLElement));

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        var p1 = this.points[0];
        var p2 = this.points[1];

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);

        for (var i = 1, len = this.points.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            var midPoint = midPointBtw(p1, p2);
            this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = this.points[i];
            p2 = this.points[i + 1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.stroke();
    }
    
    handleMouseUp = (e: MouseEvent) => {
        this.isDrawing = false;
        this.points.length = 0;
    }
}

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

var canvas = new Canvas(document.getElementById('c'));

interface Coords {
    x: number;
    y: number;
}

function getCoords (event: MouseEvent, element: HTMLElement): Coords {
    return {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
    };
}

// ReactDOM.render(<Main />, document.getElementById('main'));
