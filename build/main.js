define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    "use strict";
    var Main = React.createClass({
        render: function () {
            return React.createElement("div", null, "Hello from main.");
        }
    });
    ReactDOM.render(React.createElement(Main, null), document.getElementById('main'));
});
