# mobilejs bootstrap
A quick hybrid app ready bootstrap designed to help prototyping mobile apps quickly. The project here is designed not to replace complete web frameworks. It is more about about speeding up the process of getting a templated app structure ready where you can add a quick mobile friendly page with quick javascript tie ins. 

CanJS is the core behavior framework used for data binding and templating but other frameworks like knockout, angularjs, etc can easily be swapped in. I like CanJS because it does not rely on particular behavior javascript layer such as JQuery. The lighter weight Zepto.js can easily be dropped in.

## included components
### Foundation 5.x
### CanJS 2.x
### JQuery 2.x

## version
Current version is 1.5 and it straps JQuery for its JS layer, and Foundation for its visual skin.

## build tools
We use nodejs, bower and grunt for building. So please do install bower, nodejs and grunt.

## project bootstraping
1. Clone or checkout the template folder to be your source.
2. Inside your source folder, type 'npm install' in the command line to install all the node modules.
3. Type 'grunt' and this will create a 'build' folder with the minified files and folder. It will also bring up 'grunt-watch' and start to listen to any file changes to trigger a rebuild.
4. You can now go inside your browser on your mobile or chrome and type 'http://localhost:1777/' where localhost is your computer's IP address to test your site.
5. Edit and repeat the process.

## template structure

TBD  
