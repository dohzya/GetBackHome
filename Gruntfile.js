var path = require("path");

var renamedTasks = {
};

module.exports = function (grunt) {
  "use strict";

  var bower = require("bower");
  var _ = grunt.util._;
  var isMatch = grunt.file.isMatch;

  require("matchdep").filterDev("grunt-*").forEach(function (plugin) {
    grunt.loadNpmTasks(plugin);
    if (renamedTasks[plugin]) {
      grunt.renameTask(renamedTasks[plugin].original, renamedTasks[plugin].renamed);
    }
  });

  var configuration = {
    pkg : grunt.file.readJSON("package.json"),
    play: grunt.file.readJSON("conf/constants.json"),
    dir: {
      app: {
        root: "app",
        controllers: "controllers",
        models: "models",
        views: "views"
      },
      conf: {
        root: "conf"
      },
      public: {
        root: "public",
        styles: "<%= config.dir.public.root %>/stylesheets",
        scripts: "<%= config.dir.public.root %>/javascripts",
        fonts: "<%= config.dir.public.styles %>/fonts",
        images: "<%= config.dir.public.root %>/images"
      },
      test: {
        root: "test"
      },
      components: {
        root: "bower_components"
      }
    }
  };

  grunt.registerTask("bower", [
    "shell:bowerInstall",
    "parallel:bowerBuild",
    "clean:components"
  ]);

  grunt.registerTask("build", [
    "clean:public",
    "parallel:bowerCopy",
    "less:raw"
  ]);

  grunt.registerTask("default", [
    "build",
    "jsdoc:dist",
    "watch"
  ]);

  grunt.registerTask("deploy", [
    "clean:dist",
    "build",
    "less:dist",
    "uglify:dist"
  ]);

  grunt.registerTask("test", [
    "jshint:stdout",
    "jshint:junit"
  ]);

  grunt.initConfig({
    config: configuration,

    clean: {
      public: [
        "<%= config.dir.public.scripts %>/vendors/**/*",
        "<%= config.dir.public.styles %>/vendors/**/*",
        "<%= config.dir.public.fonts %>/vendors/**/*"
      ],
      components: [
        "<%= config.dir.components.root %>/angular/"
      ],
      dist: [
        "<%= config.dir.public.styles %>/<%= config.play.application.files.style %>*.min.css",
        "<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>*.min.js"
      ]
    },

    concat: {

    },

    less: {
      options: {
        paths: ["<%= config.dir.components.root %>", "public/stylesheets/less"]
      },
      raw: {
        files: {
          "<%= config.dir.public.styles %>/<%= config.play.application.files.style %>.css": "<%= config.dir.public.styles %>/less/main.less"
        }
      },
      dist: {
        options: {
          compress: true
        },
        files: [{
          "<%= config.dir.public.styles %>/<%= config.play.application.files.style %>.<%= config.play.application.version %>.min.css": "<%= config.dir.public.styles %>/less/main.less"
        }]
      }
    },

    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      },
      stdout: {
        files: { src: [
          "Gruntfile.js",
          "public/javascripts/*.js",
          "public/javascripts/animations/*.js",
          "public/javascripts/authentification/*.js",
          "public/javascripts/contracts/*.js",
          "public/javascripts/directive/*.js",
          "public/javascripts/global/*.js",
          "public/javascripts/user/*.js",
          "public/javascripts/util/*.js",
          "test/**/*.js",
          "!<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.<%= config.play.application.version %>.min.js"]
        },
        options: {
          "force" : true
        }
      },
      junit: {
        files: { src: [
          "Gruntfile.js",
          "public/javascripts/*.js",
          "public/javascripts/animations/*.js",
          "public/javascripts/authentification/*.js",
          "public/javascripts/directive/*.js",
          "public/javascripts/user/*.js",
          "public/javascripts/util/*.js",
          "test/**/*.js",
          "!<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.<%= config.play.application.version %>.min.js"]
        },
        options: {
          reporter: require("jshint-junit-reporter"),
          reporterOutput: "test_out/jshint.xml",
          "force" : true
        }
      }
    },

    uglify: {
      options: {
        banner: ""
      },
      dist: {
        options: {
          compress: true,
          report: "min"
        },
        files: [{
          dest: "<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.<%= config.play.application.version %>.min.js",
          src: [
            "<%= config.dir.public.scripts %>/vendors/jquery/jquery.js",
            "<%= config.dir.public.scripts %>/vendors/lodash/lodash.js",
            "<%= config.dir.public.scripts %>/vendors/angular/angular.js",
            "<%= config.dir.public.scripts %>/vendors/angular/angular-resource.js",
            "<%= config.dir.public.scripts %>/vendors/angular-ui/utils/ui-utils.js",
            "<%= config.dir.public.scripts %>/vendors/angular-ui/router/angular-ui-router.js",
            "<%= config.dir.public.scripts %>/vendors/angular-ui/bootstrap/ui-bootstrap-tpls.js",
            "<%= config.dir.public.scripts %>/vendors/restangular/restangular.js",
            "<%= config.dir.public.scripts %>/vendors/angular-http-auth/http-auth-interceptor.js",
            "<%= config.dir.public.scripts %>/main.js",
            "<%= config.dir.public.scripts %>/*.js",
            "<%= config.dir.public.scripts %>/!(vendors)/**/*.js",
            "!<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.<%= config.play.application.version %>.min.js"
          ]
        }]
      }
    },

    copy: {
      // Here start the Bower hell: manual copying of all required resources installed with Bower
      // Prefix them all with "bower"
      // Be sure to add them to the "bowerCopy" task near the top of the file
      bowerFontAwesome: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/font-awesome/fonts/",
          src: ["*"],
          dest: "<%= config.dir.public.fonts %>/vendors/fontawesome/"
        }]
      },
      bowerQ: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/q/",
          src: ["q.js", "q.min.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/q/"
        }]
      },
      bowerJQuery: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/jquery/",
          src: ["jquery.js", "jquery.min.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/jquery/"
        }]
      },
      bowerModernizr: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/modernizr/",
          src: ["modernizr.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/modernizr/"
        }]
      },
      bowerLodash: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/lodash/dist/",
          src: ["lodash.js", "lodash.min.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/lodash/"
        }]
      },
      bowerAngular: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/angular-latest/build/",
          src: ["*.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/angular/"
        }]
      },
      bowerRestangular: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/restangular/dist/",
          src: ["restangular.js", "restangular.min.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/restangular/"
        }]
      },
      bowerAngularHttpAuth: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/angular-http-auth/src/",
          src: ["*.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/angular-http-auth/"
        }]
      },
      bowerAngularUiRouter: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/angular-ui-router/release/",
          src: ["*.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/angular-ui/router/"
        }]
      },
      bowerAngularUiUtils: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/angular-ui-utils/components/angular-ui-docs/build/",
          src: ["*.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/angular-ui/utils/"
        }]
      },
      bowerAngularUiBootstrap: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components.root %>/angular-bootstrap/",
          src: ["*.js"],
          dest: "<%= config.dir.public.scripts %>/vendors/angular-ui/bootstrap/"
        }]
      }
    },

    shell: {
      bowerInstall: {
        command: "bower install",
        options: {
          stdout: true
        }
      },
      angularNpm: {
        command: "(cd ./bower_components/angular-latest && exec npm install)",
        options: {
          stdout: true
        }
      },
      angularPackage: {
        command: "(cd ./bower_components/angular-latest && exec grunt clean buildall)",
        options: {
          stdout: true
        }
      },
      angularUiUtilsNpm: {
        command: "(cd ./bower_components/angular-ui-utils && exec npm install)",
        options: {
          stdout: true
        }
      },
      angularUiUtilsBuild: {
        command: "(cd ./bower_components/angular-ui-utils && exec grunt build)",
        options: {
          stdout: true
        }
      },
      karmae2e: {
        command: "./node_modules/karma/bin/karma start conf/karma-e2e-9.conf.js",
        options: {
          stdout: true
        }
      }
    },

    parallel: {
      options: {
        grunt: true
      },
      bowerBuild: {
        tasks: [
          ["shell:angularNpm", "shell:angularPackage"]
          //["shell:angularUiUtilsNpm", "shell:angularUiUtilsBuild"]
        ]
      },
      bowerCopy: {
        tasks: [
          "copy:bowerFontAwesome",
          "copy:bowerQ",
          "copy:bowerJQuery",
          "copy:bowerModernizr",
          "copy:bowerLodash",
          "copy:bowerAngular",
          "copy:bowerRestangular",
          "copy:bowerAngularHttpAuth",
          "copy:bowerAngularUiRouter",
          "copy:bowerAngularUiUtils",
          "copy:bowerAngularUiBootstrap"
        ]
      }
    },

    jsdoc : {
      dist : {
        src: ['<%= config.dir.public.scripts %>/!(vendors)/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },

    watch: {
      options: {
        livereload: false,
        forever: true
      },
      less: {
        files: ["<%= config.dir.public.styles %>/less/*.less", "<%= config.dir.public.styles %>/less/**/*.less"],
        tasks: ["less:raw"]
      },
      jsdoc: {
        files: ["<%= config.dir.public.scripts %>/!(vendors)/**/*.js"],
        tasks: ["jsdoc:dist"]
      },
      public: {
        options: {
          livereload: true
        },
        files: [
          "<%= config.dir.app.root %>/**/*.scala",
          "<%= config.dir.app.root %>/**/*.html",
          "<%= config.dir.conf.root %>/*",
          "<%= config.dir.public.scripts %>/*.js",
          "<%= config.dir.public.scripts %>/**/*.js",
          "<%= config.dir.public.styles %>/*.css",
          "<%= config.dir.public.styles %>/**/*.css"
        ],
        tasks: []
      }
    }
  });

};
