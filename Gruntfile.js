var path = require('path');
var webpack = require("webpack");

module.exports = function(grunt) {

  var webpackConfig = require("./webpack.config.js");
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: '<%= pkg.directories %>',
    css: grunt.file.readJSON('css.json'),
    js: grunt.file.readJSON('js.json'),
    
    concurrent: {
       dev: ['concat','stylus'],
       dev2: ['watch','webpack'],
       prod: ['uglify', 'stylus', 'webpack-prod'],
        options: {
                logConcurrentOutput: true
            }
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>*/\n',
 
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        sourceMap: true
      },

      libsJs: '<%= js.libs %>',
      
      // mainCss: '<%= css.main %>',
      libsCss: '<%= css.libs %>'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      libs: {
        src: '<%= js.libs.dest %>',
        dest: '<%= js.libs.dist %>'
      }
    },
    "webpack-dev-server": {
      options: {
        webpack: webpackConfig
      },
      start: {
        keepAlive: true,
        webpack: {
          devtool: "eval",
          debug: true
        }
      }
    },
    webpack: {
      options: webpackConfig,
      build: {
        
        output: {
          publicPath: "/public/js/"
        },
        keepalive: false,
        watch: false,
        plugins: webpackConfig.plugins.concat(
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        )
      }
    },
    stylus: {
      compile: {
        options: {
           paths:  ['public/styles'],
           compress:false
        },
        files: {
          'public/css/main.css': [
            'public/styles/**/*.styl'
          ]
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
//    qunit: {
//      files: ['test/**/*.html']
//    },

    watch: {
      styl: {
         files: 'public/styles/**/*.styl',
         tasks: 'stylus',
         options: {
           livereload: false,
           spawn:false
         }
       },
      css: {
          files: 'public/css/main.css',
          tasks: 'watch',
          options: {
            livereload: true,
            spawn:false
          }
       },

      // js: {
      //   files: ['public/javascripts/**/*.js'],
      //   tasks: ['dev'],
      //   options: {
      //     livereload: false
      //   }
      // }, 
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['default']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  grunt.registerTask('styl', [], function () {
    grunt.task.run('stylus');
  });

  grunt.registerTask('default', ['concurrent:dev', 'concurrent:dev2']);
  grunt.registerTask('prod', ['concat', 'concurrent:prod']);
   
  grunt.registerTask('webpack', [], function () {
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-webpack-server');

    grunt.task.run('webpack-dev-server:start');
});

  grunt.registerTask('webpack-prod', [], function () {
    grunt.loadNpmTasks('grunt-webpack');

    grunt.task.run('webpack:build');
});

};
