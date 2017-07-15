# topolysis

>  Topologically sort directed acyclic graph with fast tracking

<p align="right">
    <a href="https://github.com/epiloque/topolysis/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/topolysis.svg"
             alt="license">
    </a>
    <a href="https://npmjs.org/package/topolysis">
        <img src="https://img.shields.io/npm/v/topolysis.svg"
             alt="npm version">
    </a>
    <a href="https://travis-ci.org/epiloque/topolysis">
        <img src="https://img.shields.io/travis/epiloque/topolysis.svg"
             alt="build status">
    </a>
</p>

# Getting Started

```bash
$ npm install --save topolysis
```

# Usage

```javascript
'use strict'

const topolysis = require('topolysis')

const data = {
    'tie your shoes': ['put on your shoes'],
    'put on your shoes': ['put on your shorts'],
    'put on your jacket': ['put on your shirt', 'put on your shorts']
}

for (const x of topolysis(data)) {
    console.log(x)
}

// [ 'put on your shirt', 'put on your shorts' ]
// [ 'put on your jacket', 'put on your shoes' ]
// [ 'tie your shoes' ]

```

# License

Copyright (c) 2016 Mark Milstein <mailto:mark@epiloque.com>

topolysis is licensed under the MIT License

    http://www.opensource.org/licenses/MIT
