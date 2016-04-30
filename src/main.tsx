import * as React from 'react';
import * as ReactDOM from 'react-dom';

let Main = React.createClass({
    render() {
        return <div>Hello from main.</div>;
    }
});

ReactDOM.render(<Main />, document.getElementById('main'));
