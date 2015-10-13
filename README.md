# webpack_chunk_strange
Webpack issue to test chunkhash

node -v => v4.1.0
webpack => 1.12.2

This is a test project for an issue I'm submitting to Webpack.

First install all the dependencies

    npm install

Then generate the build/ directory:

    npm run build

You get something like this:

    Hash: 67218b28591b0e5a510d
    Version: webpack 1.12.2
    Time: 6402ms
                          Asset       Size  Chunks             Chunk Names
    app.860846ea86c7b67eddd0.js       132 kB       0  [emitted]  app
    styles.860846ea86c7b67eddd0.css   21 bytes       0  [emitted]  app
    index.html                        274 bytes          [emitted]  
    
    + 158 hidden modules
    Child extract-text-webpack-plugin:
        + 2 hidden modules

Notice that the hash is **860846ea86c7b67eddd0** for the .js and .css file

Here's the md5's of the files:

md5 build/*

    MD5 (build/app.860846ea86c7b67eddd0.js) = 93ba8627aab7bb61951386419ed65082
    MD5 (build/styles.860846ea86c7b67eddd0.css) = f170406bbf80db11a0f7afdee504fa52
  
Right, let's change the css file app/main.css (from blue to red)

    body {
      background: red;
    }
    
npm run build

    Hash: 9ff11597ca1b614f0863
    Version: webpack 1.12.2
    Time: 6431ms
                              Asset       Size  Chunks             Chunk Names
    app.353477b32cc15ea06465.js     132 kB       0  [emitted]  app
    styles.353477b32cc15ea06465.css   20 bytes       0  [emitted]  app


Notice that the hash has changed (**353477b32cc15ea06465**) for BOTH .css and .js although we edited just the .css file


md5 build/*

    MD5 (build/app.353477b32cc15ea06465.js) = 93ba8627aab7bb61951386419ed65082
    MD5 (build/styles.353477b32cc15ea06465.css) = a9e1e9ad1b183e6166efd88af91e8761

  Note that the .js has the same md5 as the previous one (**93ba8627aab7bb61951386419ed65082**).
  
It also has the same behaviour if you do the reverse (change just the .js file, e.g. change text in compoments/App.jsx).

So, no idea why both files have the same hash, and why the hash of the .js file changed even though the contents of the file have not changed (no difference in md5).
