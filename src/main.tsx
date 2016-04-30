interface Point {
    x: number;
    y: number;
}

interface Segment {
    points: Point[];
    color: string;
    key?: string;
}

// https://en.wikipedia.org/wiki/Tango_Desktop_Project#Palette
let COLORS = "edd400 f57900 c17d11 73d216 3465a4 75507b cc0000 d3d7cf 555753"
    .split(" ").map(color => "#" + color);
let COLOR_INDEX = 0;

function getColor() {
    return COLORS[COLOR_INDEX++ % COLORS.length];
}

class Canvas {
    segments: Segment[];
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isDrawing: Boolean;
    db: SegmentsDatabase;
    
    constructor(element) {
        this.segments = [{points: [], color: getColor()}];
        this.element = element;
        
        element.onmousedown = this.handleMouseDown;
        element.onmousemove = this.handleMouseMove;
        element.onmouseup = this.handleMouseUp;
        
        this.ctx = element.getContext('2d');
        this.ctx.lineWidth = 10;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        
        this.db = new SegmentsDatabase({
            onAdd: this.handleSegmentAdd,
            onUpdate: this.handleSegmentUpdate,
            onClear: () => {
                this.segments = [{points: [], color: getColor()}];
                this.redraw();
            }
        });
    }
    
    getSegment(): Segment {
        return this.segments[this.segments.length - 1];
    }
    
    handleSegmentAdd = (segment: Segment, key: string, prevKey: string) => {
        // console.log('segment add ' + key + ' ' + prevKey + ' ' + segment.points.length);
        this.segments.push(segment);
        this.redraw();
    }
    
    handleSegmentUpdate = (segment: Segment, key: string, prevKey: string) => {
        // console.log('segment update ' + key + ' ' + prevKey + ' ' + segment.points.length);
        this.segments.forEach(s => {
            if (s.key == key) {
                s.points = segment.points;
                s.color = segment.color;
            }
        });
        this.redraw();
    }
    
    handleMouseDown = (e: MouseEvent) => {
        this.isDrawing = true;
        let key = this.db.add({points: [getCoords(e, e.currentTarget as HTMLElement)], color: getColor()});
        this.getSegment().key = key;
    }
    
    handleMouseMove = (e: MouseEvent) => {
        if (!this.isDrawing) return;

        this.getSegment().points.push(getCoords(e, e.currentTarget as HTMLElement));
        this.db.update(this.getSegment());
    }
    
    handleMouseUp = (e: MouseEvent) => {
        this.isDrawing = false;
    }
    
    redraw = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.segments.forEach(segment => drawSegment(this.ctx, segment));
    }
}

function drawSegment (ctx: CanvasRenderingContext2D, {points, color}: Segment) {
    // Draw continuous bezier throught midpoints, with `points` as bezier
    // control points. In this example 0, 1, 2, 3, 4 are the `points`, and
    // 1-2, 2-3, 3-4 are the midpoints:
    //
    //                       3
    //    1
    //                       XX
    //    XXX              XX  X
    //   X   X            X     X 3-4
    //  X     X 1-2      X       
    // X       X        X 2-3
    // X        X      X
    // 0         X    X
    //            XXXX              4
    //
    //              2
    //
    
    if (points.length < 1) { return; }
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
        let end = midPoint(points[i], points[i + 1]);
        let control = points[i];
        ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
    }

    // Draw last line as a straight line (to point 4 in the example above)
    let last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
}

function midPoint(p1: Point, p2: Point): Point {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

function getCoords (event: MouseEvent, element: HTMLElement): Point {
    return {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
    };
}

class SegmentsDatabase {
    firebase: Firebase;
    
    constructor({onAdd, onUpdate, onClear}) {
        this.firebase = new Firebase("https://popping-torch-5328.firebaseio.com/");

        this.firebase.child('segments').orderByKey().on('child_added', (snapshot, prevChildKey) =>
            onAdd(snapshot.val(), snapshot.key(), prevChildKey));

        this.firebase.child('segments').on('child_changed', (snapshot, prevChildKey) =>
            onUpdate(snapshot.val(), snapshot.key(), prevChildKey));

        this.firebase.child('segments').on('value', snapshot => {
            if (!snapshot.hasChildren()) {
                onClear();
            }
        });
    }
    
    add(segment: Segment): string {
        let ref = this.firebase.child('segments').push();
        ref.set(segment);
        return ref.key();
    }

    update(segment: Segment) {
        let {key, points, color} = segment;
        this.firebase.child('segments').child(key).update({points, color});
    }
}

function main() {
    new Canvas(document.getElementById('c'));
}

main();