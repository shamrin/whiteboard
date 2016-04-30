// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// let Main = React.createClass({
//     render() {
//         return <div>Hello from main.</div>;
//     }
// });

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

var el = document.getElementById('c');
var ctx = el.getContext('2d');

ctx.lineWidth = 10;
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, points = [];

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

el.onmousedown = function (e: MouseEvent) {
    isDrawing = true;
    points.push(getCoords(e, e.currentTarget as HTMLElement));
};

el.onmousemove = function (e: MouseEvent) {
    if (!isDrawing) return;

    points.push(getCoords(e, e.currentTarget as HTMLElement));

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var p1 = points[0];
    var p2 = points[1];

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (var i = 1, len = points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        var midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points[i];
        p2 = points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
};

el.onmouseup = function () {
    isDrawing = false;
    points.length = 0;
};

// ReactDOM.render(<Main />, document.getElementById('main'));
