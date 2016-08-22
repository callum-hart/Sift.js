module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          "lib/js/sift.js": "src/coffee/sift.coffee",
          "docs/dist/js/docs.js": "docs/src/coffee/docs.coffee"
        }
      }
    },
    less: {
      development: {
        files: {
          "lib/css/sift.css": "src/less/sift.less",
          "docs/dist/css/docs.css": "docs/src/less/docs.less"
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          "lib/js/sift.min.js": "lib/js/sift.js"
        }
      }
    },
    cssmin: {
      my_target: {
        src: "lib/css/sift.css",
        dest: "lib/css/sift.min.css"
      }
    },
    watch: {
      files: ["src/less/*", "src/coffee/*", "docs/src/less/*", "docs/src/coffee/*"],
      tasks: ["coffee", "less", "uglify", "cssmin"],
      options: {
        livereload: true
      }
    }
  });
};