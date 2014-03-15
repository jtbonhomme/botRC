/* jshint node:true */

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
  'use strict';

  var
    _ = grunt.util._,

    // Config files
    PKG    = grunt.file.readJSON('package.json');

  var lint = grunt.option('lint') !== false;

  // Load tasks
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);


  // Project configuration.
  grunt.initConfig({
    pkg: PKG,

    dirs: {
      node:    'node_modules/',
      app:     'app/',
      js:      'app/js/',
      vendors: 'app/vendors/',
      css:     'app/css/',
      tmp:     'tmp/',
      public:  'public/'
    },

    files: {
      all: '**/*',
      js:  '**/*.js',
      map:  '**/*.map',
      css: '**/*.css',
      img: '**/*.{png,gif,jpg,jpeg}'
    },

    meta: {
      banner: [
        '/**',
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
        ' */'
      ].join('\n')
    },

    // Building/Concatenating tasks
    //
    copy: {
      js: {
        expand: true,
        src: ['<%= dirs.js %><%= files.js %>'],
        dest: '<%= dirs.tmp %>'
      },
      vendors: {
        expand: true,
        flatten: true, // do not copy dir hierarchy, copy all js files directly under dest:
        src: ['<%= dirs.vendors %><%= files.js %>'],
//        src: ['<%= dirs.vendors %><%= files.js %>', '<%= dirs.vendors %><%= files.map %>'],
        dest: '<%= dirs.public %>js'
      }
    },

    // Web assets processor
    // Parses directives like "//= require ..."
    mince: {
      dist: {
        src: 'app.js',
        include: [
          '<%= dirs.tmp %>app/js'
        ],
        dest: '<%= dirs.tmp %>fullapp.js'
      }
    },


    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      js: {
        src: [
          '<%= mince.dist.dest %>',
          '<%= dirs.js %>boot.js'
        ],
        dest: '<%= dirs.public %>js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          '<%= dirs.css %><%= files.css %>'
        ],
        dest: '<%= dirs.public %>css/<%= pkg.name %>.css'
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        '<%= dirs.js %><%= files.js %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      all: [
        '<%= dirs.tmp %>*',
        '<%= dirs.public %>js/*',
        '<%= dirs.public %>css/*',
        '<%= dirs.public %>index.html'
      ],
      tmp: ['<%= dirs.tmp %>*']
    },

    // Developement tools
    //
    watch: {
      scripts: {
        files: ['<%= dirs.js %><%= files.js %>', '<%= dirs.css %><%= files.css %>', 'Gruntfile.js', '<%= dirs.app %>index.html'],
        tasks: ['jshint', 'copy:js', 'copy:vendors', 'mince', 'concat:js', 'concat:css', 'index', 'clean:tmp']
      }
    }
  });

  grunt.registerTask('index', 'Create the index.html file', function() {
    var src = grunt.config.process('<%= dirs.app %>index.html');
    var dst = grunt.config.process('<%= dirs.public %>index.html');
    var data = grunt.file.read(src);
    grunt.file.write(dst, data);
    grunt.log.ok();
  });

  var buildJS  = ['copy:js', 'copy:vendors', 'mince', 'concat:js'];
  var buildAll = _.compact([(lint && 'jshint'), 'clean:all', 'build:js', 'build:css', 'index', 'clean:tmp']);

  grunt.registerTask('build:css',   'Builds the css',          ['concat:css']);
  grunt.registerTask('build:js',    'Builds the javacript',    buildJS);
  grunt.registerTask('build',       'Builds the whole app',    buildAll);

  // Default
  grunt.registerTask('default', 'build');
};




