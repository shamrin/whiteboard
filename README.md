### What is it?

Simple multi-user whiteboard with real-time synchronization.

[See online demo here.](https://whiteboard-9781b.firebaseapp.com)

### Why?

To play with Firebase and TypeScript.

### Tech stack

* Firebase
* TypeScript
* React
* SystemJS

### Hacking

Clone, build and run dev server:

    git clone https://github.com/shamrin/whiteboard.git
    cd whiteboard/
    npm start

Open browser: http://127.0.0.1:8000

### Deploying

    npm install -g firebase-tools
    ./build.sh
    firebase deploy

### Why `node_modules/` is committed to the repository?

1. It's convinient to be able to build the project no matter what happens with npm or third-party libraries. See also: [Hermetic build][1].
2. Neither Yarn, nor package-lock.json existed at the time this project was created.

[1]: https://landing.google.com/sre/book/chapters/release-engineering.html#hermetic-builds-nqslhnid
