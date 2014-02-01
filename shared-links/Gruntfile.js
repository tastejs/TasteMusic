module.exports = function(grunt) {
  grunt.initConfig({  
    pkg: grunt.file.readJSON('package.json'),

    /* CONCAT FILES
     * -------------------------------------
     */
    concat: {
      options: {},

      css_concat: {
        files: {
          'dist/css/style.min.css': [
            'css/style.css'
          ]
        }
      },

      js_concat: {
        files: {
          'dist/js/application.min.js': [
            'js/vendors/underscore.min.js',
            'js/helpers.js',
            'js/comments_parser.js',
            'js/main.js'
          ]
        }
      }
    },


    /* MINIFY CSS
     * -------------------------------------
     */
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
        report: 'min'
      },

      minify: {
        files: {
          'dist/css/style.min.css': 'dist/css/style.min.css'
        }
      }
    },


    /* UGLIFY JS
     * -------------------------------------
     */    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: true
      },

      build: {
        files: {
          'dist/js/application.min.js': 'dist/js/application.min.js'
        }
      }
    }
  });

  // Load the Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register the default task
  grunt.registerTask('default', ['concat', 'cssmin', 'uglify']);

};