"use strict"

# Plugin tasks to be renamed to prevent conflict from plugins having the same task name.
# Be sure to include renamed plugins first
renamedTasks =
  "grunt-bower-hooks":
    original: "bower"
    renamed: "bowerHooks"
  "grunt-bower-task":
    original: "bower"
    renamed: "bowerTask"

module.exports = (grunt) ->
  bower = require("bower")
  path = require("path")
  refreshResetFlag = false

  require('matchdep').filter('grunt-*').forEach( (plugin) ->
    grunt.loadNpmTasks plugin
    if renamedTasks[plugin]
      grunt.renameTask(renamedTasks[plugin].original, renamedTasks[plugin].renamed)

  )

  appConfig =
    pkg : grunt.file.readJSON("package.json")
    filename: "<%= config.pkg.name %>"
    version: "<%= config.pkg.version %>"
    filenameversion: "<%= config.filename %>-<%= config.version %>"
    dir:
      app: "app"
      components: "components"
      resources:
        root: "resources"
        less: "<%= config.dir.resources.root %>/less"
        coffee: "<%= config.dir.resources.root %>/coffee"
        scripts: "<%= config.dir.resources.root %>/javascripts"
        images: "<%= config.dir.resources.root %>/images"
        fonts: "<%= config.dir.resources.root %>/fonts"
      dist:
        root: "public"
        images: "<%= config.dir.dist.root %>/images"
        styles: "<%= config.dir.dist.root %>/stylesheets"
        scripts: "<%= config.dir.dist.root %>/javascripts"
        vendors: "<%= config.dir.dist.scripts %>/vendors"
      tmp:
        root: "tmp"
        coffee: "<%= config.dir.tmp.root %>/coffee"
        scripts: "<%= config.dir.tmp.root %>/scripts"

  grunt.registerTask("default", ["build", "livereload-start", "regarde"])

  grunt.registerTask("update", ["bowerInstall"])

  grunt.registerTask("build", ["coffeeBuild", "lessBuild", "javascriptBuild", "bower:build", "imagesBuild", "fontsBuild"])
  grunt.registerTask("dist", ["coffeeDist", "lessDist", "javascriptDist", "bower:build", "imagesBuild", "fontsBuild", "concat:postDist", "uglify"]) # , "jshint"

  grunt.registerTask("coffeeBuild", ["clean:tmpCoffee", "clean:scripts", "coffee:raw"])
  grunt.registerTask("coffeeDist", ["clean:tmpCoffee", "clean:tmpScripts", "clean:scripts", "coffee:dist"])

  grunt.registerTask("lessBuild", ["clean:styles", "recess:raw"])
  grunt.registerTask("lessDist", ["clean:styles", "recess"])

  grunt.registerTask("javascriptBuild", ["copy:javascripts"])
  grunt.registerTask("javascriptDist", ["copy:javascripts"])

  grunt.registerTask("imagesBuild", ["copy:images"])
  grunt.registerTask("fontsBuild", ["copy:fonts"])

  grunt.registerTask("javascripts", ["copy:javascriptsRefresh"])


  grunt.registerTask("bowerInstall", "Install all bower dependencies", () ->
    verboseLog = if grunt.option("verbose") then grunt.log else grunt.verbose
    done = this.async()
    bower.commands.install()
      .on('data', (data) ->
        verboseLog.writeln(data)
      )
      .on('end', () ->
        grunt.log.ok("Bower packages installed successfully")
        done()
      )
      .on('error', (error) ->
        grunt.fail.fatal(error)
      )
  )

  grunt.registerMultiTask('refresh', 'Refresh modified files', () ->
    this.requires("regarde")
    grunt.verbose.writeln("refresh:" + this.target + ' -> ' + JSON.stringify(this.data))
    tasks = []

    clean = grunt.config("clean")
    if (clean && clean.refresh)
      tasks.push("clean:refresh")

    config = grunt.config(this.target)
    grunt.verbose.writeln(JSON.stringify(config))
    if (config && config.refresh)
      tasks.push(this.target + ":refresh")

    grunt.verbose.writeln(tasks)
    grunt.task.run(tasks)
    refreshResetFlag = true
  )

  updateCleanRefresh = (filepath) ->
    clean = grunt.config("clean") || {}
    cleanRefresh = clean.refresh || []
    cleanRefresh.push(filepath)
    grunt.log.writeln(JSON.stringify(clean))
    grunt.config("clean", clean)

  updateCoffeeRefresh = (filepath) ->
    coffee = grunt.config("coffee") || {}
    coffeeRefresh = coffee.refresh || {}
    coffeeRefresh.files = coffeeRefresh.files || []
    coffeeRefresh.files.push(
      expand: true
      cwd: path.dirname(filepath)
      src: path.basename(filepath)
      dest: path.dirname(filepath).replace("resources/coffee", "public/javascripts")
      ext: ".js"
    )
    grunt.config("coffee", coffee)

  updateCopyJavascript = (filepath) ->
    copy = grunt.config("copy") || {}
    copyJavascripts = copy.javascriptsRefresh || {}
    copyJavascripts.src = copyJavascripts.files || []
    copyJavascripts.src.push(filepath.replace("resources/javascripts/", ""))
    grunt.config("copy", copy)

  grunt.event.on("regarde:file", (status, target, filepath) ->
    grunt.verbose.writeln("regarde:file " + status + " - " + target + " - " + filepath)
    if (refreshResetFlag)
      clean = grunt.config("clean") || {}
      clean.refresh = []
      grunt.config("clean", clean)

      coffee = grunt.config("coffee") || {}
      coffeeRefresh = coffee.refresh || {}
      coffeeRefresh.files = []
      grunt.config("coffee", coffee)

      copy = grunt.config("copy") || {}
      copyJavascript = copy.javascript || {}
      copyJavascript.src = []
      grunt.config("copy", copy)

      refreshResetFlag = false

    if (filepath && status == "deleted")
      switch target
        when "coffee" then updateCleanRefresh(filepath.replace("resources/coffee", "public/javascripts").replace(".coffee", ".js"))
        when "javascripts" then updateCleanRefresh(filepath.replace("resources/javascripts", "public/javascripts"))
        else ""
    else if (filepath && !grunt.file.isDir(filepath))
      switch target
        when "coffee" then updateCoffeeRefresh(filepath)
        when "javascripts" then updateCopyJavascript(filepath)
        else ""

  )

  grunt.initConfig
    config: appConfig

    meta:
      banner : '/*! <%= config.pkg.title || config.pkg.name %> - v<%= config.pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= config.pkg.homepage ? "* " + config.pkg.homepage + "\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= config.config.pkg.author.name %>;' +
          ' Licensed <%= _.pluck(config.pkg.licenses, "type").join(", ") %> */'

    bowerInstall: {}

    bower:
      build:
        dest: "<%= config.dir.dist.scripts %>/vendors"
#        options:
#          basePath: "components/"


    clean:
      refresh: []
      tmpCoffee: ["<%= config.dir.tmp.coffee %>"]
      tmpScripts: ["<%= config.dir.tmp.scripts %>"]
      styles: ["<%= config.dir.dist.styles %>"]
      scripts: ["<%= config.dir.dist.scripts %>"]
      images: ["<%= config.dir.dist.images %>"]

    concat:
      postDist:
        files:
          "<%= config.dir.dist.scripts %>/main-<%= config.version %>.js": [
            "<%= config.dir.components %>/jquery/jquery.js",
            "<%= config.dir.components %>/lodash/lodash.js",
            "<%= config.dir.tmp.scripts %>/main-<%= config.version %>.js"
          ]

    copy:
      fonts:
        expand: true
        dot: true
        cwd: "<%= config.dir.resources.fonts %>"
        dest: "<%= config.dir.dist.styles %>/fonts"
        src: ["**/*"]
      images:
        expand: true
        dot: true
        cwd: "<%= config.dir.resources.images %>"
        dest: "<%= config.dir.dist.images %>"
        src: ["*"]
      javascripts:
        expand: true
        dot: true
        cwd: "<%= config.dir.resources.scripts %>"
        dest: "<%= config.dir.dist.scripts %>"
        src: ["**/*.js"]
      javascriptsRefresh:
        expand: true
        dot: true
        cwd: "<%= config.dir.resources.scripts %>"
        dest: "<%= config.dir.dist.scripts %>"
        src: []

    coffee:
      refresh: {}
      raw:
        expand: true
        cwd: "<%= config.dir.resources.coffee %>"
        src: ["**/*.coffee"]
        dest: "<%= config.dir.dist.scripts %>"
        ext: ".js"
        options:
          bare: true
      dist:
        options:
          join: true
          bare: true
        files:
          "<%= config.dir.dist.scripts %>/require-main-<%= config.version %>.js": ["<%= config.dir.resources.coffee %>/require-main.coffee"]
          "<%= config.dir.tmp.scripts %>/main-<%= config.version %>.js": ["<%= config.dir.resources.coffee %>/main.coffee", "<%= config.dir.resources.coffee %>/**/*.coffee", "!<%= config.dir.resources.coffee %>/require-main.coffee"]

    recess:
      raw:
        options:
          compile:true
        files:
          "<%= config.dir.dist.styles %>/main-<%= config.version %>.css": ["<%= config.dir.resources.less %>/main.less"]
      min:
        options:
          compile:true
          compress: true
        files:
          "<%= config.dir.dist.styles %>/main-<%= config.version %>.min.css": ["<%= config.dir.dist.styles %>/main-<%= config.version %>.css"]

    uglify:
      js:
        files:
          "<%= config.dir.dist.scripts %>/require-<%= config.version %>.min.js": [ "<%= config.dir.dist.scripts %>/require-<%= config.version %>.js" ]
          "<%= config.dir.dist.scripts %>/main-<%= config.version %>.min.js": [ "<%= config.dir.dist.scripts %>/main-<%= config.version %>.js" ]

    jshint:
      options:
        jshintrc: ".jshintrc"
      all: ["<%= config.dir.dist.scripts %>/main-<%= config.version %>.js"]

    javascripts:
      refresh: {}

    requirejs:
      dist:
        options:
          baseUrl: "public/javascripts"
          optimize: "none"
          preserveLicenseComments: false
          useStrict: true
          wrap: true

    refresh:
      clean: {}
      coffee: {}
      javascripts: {}

    regarde:
      coffee:
        files: ["resources/coffee/**/*"]
        tasks: ["refresh:coffee"]
      less:
        files: ["resources/less/**/*"]
        tasks: ["lessBuild"]
      javascripts:
        files: ["resources/javascripts/**/*"]
        tasks: ["refresh:javascripts"]
      js:
        files: ["public/javascripts/**/*"]
        tasks: ["livereload"]
      css:
        files: ["public/stylesheets/**/*"]
        tasks: ["livereload"]
      app:
        files: ["app/**/*"]
        tasks: ["livereload"]
      conf:
        files: ["conf/*"]
        tasks: ["livereload"]
