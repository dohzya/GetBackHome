[![Stories in Ready](https://badge.waffle.io/dohzya/GetBackHome.png?label=ready)](https://waffle.io/dohzya/GetBackHome)  
# Welcome on Get Back Home #

Based on the awesome bootstrap https://github.com/jege/jege-play

## Development tools ##

If you want to build the project from scratch, you will need the following tools:

- Git: [http://git-scm.com/](http://git-scm.com/)
- PlayFramework: [http://www.playframework.com/](http://www.playframework.com/)
- NPM: [https://npmjs.org/](https://npmjs.org/)
- Grunt: [http://gruntjs.com/](http://gruntjs.com/)

### Git ###

Sorry there, but I hope you already know a bit about Git and you have it on your computer. Just use it to clone the
project. For the rest of the README, the path where you have cloned it will be called [PROJECT].

### PlayFramework ###

Installing PlayFramework should be quite easy. Just download it in 2.1.1 version and extract it. It will give you a
new nice shell command named `play` which is located at the root of the extract archive. Run it in [PROJECT]. It should
open the Play console which is really nice to handle the project with nice commands like `compile`, `run` and many more.

Try to `compile` first. When finished, launch the `run` command, it will start a
[server on port 9000](http://localhost:9000). You can now access the site but without any style or javascript because
we will need Grunt to compile them.


### NPM ###

We will NPM to install Grunt and its plugins. Please, read the doc about how to install both Node.js and NPM:

- [https://github.com/isaacs/npm](https://github.com/isaacs/npm)
- [https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

The moment you got an `npm` command in your shell, it's your win.

### Grunt ###

Grunt is an awesome tool to build a project. Play could build our resources by its own but I prefer using Grunt to
have more control, faster execution and live-reloading. Just install it following the
[Getting started guide](http://gruntjs.com/getting-started). Remember: install the CLI as global but install Grunt as
local to the project.

Once Grunt is ready, you will need to install all required plugins. Quite easy. Take a look at [PROJECT]/package.json,
for all "devDepencies" in there, you will need to run `npm install (dev dependency name)` like
`npm install grunt-contrib-concat`. Got them all? Nice.

Finally, inside [PROJECT], launch the `grunt` command, it should compile all resources and start live-reloading of the
project. Just refresh your page at [http://localhost:9000](http://localhost:9000) and you should have a warm welcoming
message.

### Summary ###

If you have the tools installed, here is the standard procedure to start the project:

- Open 2 shells and for both, go to [PROJECT]
- In the first one, run `play`
- Once the Play console is started, launch `run` in order to start Play server
- In the second shell, first run `grunt update` then `grunt`, it will compile all resources and start live-reloading
- Open a browser
- Go to [http://localhost:9000](http://localhost:9000)
- This will automatically compile the Play project and display the index page of the site
- Enjoy developping while looking at your browser reloading your code by its own at each modification


## Deploy ##

```
heroku config:set BUILDPACK_URL=https://github.com/SteamOff/heroku-buildpack-scala-grunt.git
```


