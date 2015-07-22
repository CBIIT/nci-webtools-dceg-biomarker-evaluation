* Jade
* stylus
* LiveScript
* gulp
* bower

* partial templates written in jade are turned into html and included in `index.html`
* css files are concatenated into `styles.css`

# Usage
* Code and file structure is managed and compiled by the Gulp.js build system (http://gulpjs.com/, https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) 
* always work inside of the src folder (except when editing R files)
* R scripts should be kept outside of the `src` folder and placed in the folder for the specific tool it is used for.
* store html jade file templates inside jade folder, the pages folder contain the actual content for each page, these are 'included' in the layout.jade and at compilation will be merged in the `index.jade` -> `index.html` (review resource @ http://jade-lang.com/)
* livescript files go inside ls folder (compiles to javascript, review resources at http://livescript.net/)
* static scripts (js, py, etc.) which won't be precompiled should be stored in the scripts folder and they will be copied as is to the root during code compilation

## --- DO THIS AT FIRST USE--
Install required packages:
1.    install node.js, if not already installed
2.    run following commands in command line in the directory which the code will be
3.    `$ npm install` -- to download node packages required for this project (Only need to run when first pulling down code or when new node_packages are added in package.json)
4.    `$ npm run build` -- to compile code which is placed in the root folder

* Once compiled the code will be generated one folder level above the gulpfile.js in the project root directory

Compile code by running `$ npm run build` in command line while in the `src` directory