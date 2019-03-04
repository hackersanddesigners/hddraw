/*global module:false*/

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			all: {
				options: { livereload: true },
				files: ['**/*.js', '**/*.html', '**/*.css'],
				tasks: ['jshint'],
			},
		},
		jshint: {
			files: [ 'Gruntfile.js', 'js/*.js' ],
			options: {
				globals: {
					jQuery: true
				}
			}
		}
	});

	grunt.registerTask('default', ['watch']);
};