import * as React from 'react';

React.createClass({
    render() {
        return <div>Hello world!</div>;
    }
});
function greeter(person: string) {
    return "Hello, " + person;
}

var user = "Hello world!!!";

document.body.innerHTML = greeter(user);
