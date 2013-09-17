module.exports = (grunt) ->
  grunt.initConfig
    clean:
      all: [
        'tmp/**/*.js'
      ]
    coffee:
      build:
        options:
          sourceMap: false
          bare: true
        files: [
          expand: true
          cwd: 'sources'
          src: [
            '**/*.coffee'
          ]
          dest: 'tmp/'
          ext: '.js'
        ]
    jshint:
      options:
        shadow: true
      all: [
        'tmp/**/*.js'
      ]
    connect:
      server:
        options:
          port: 9001
          base: './'
    jasmine:
      options:
        helpers: [
          'tmp/spec/support/**/*.js'
        ]
        host: 'http://127.0.0.1:<%= connect.server.options.port %>/'
      reticence:
        options:
          specs: [
            'tmp/spec/lib/jquery-reticence_spec.js'
          ]
        src: [
          'vendor/libs/jquery-1.9.1.min.js'
          'tmp/lib/jquery-reticence.js'
        ]

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'test', [
    # preparing
    'clean:all'
    'coffee'
    'jshint'
    # testing
    'connect:server'
    'jasmine'
  ]
