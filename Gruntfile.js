module.exports = function(grunt) {

	// Config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			dist: {
				files: {
					src: ['ideal-image-slider.js']
				}
			},
			extensions: {
				files: {
					src: ['extensions/**/*.js']
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! Ideal Image Slider v<%= pkg.version %> */\n'
			},
			dist: {
				files: {
					'ideal-image-slider.min.js': 'ideal-image-slider.js'
				}
			}
		},

		'string-replace': {
			version: {
				options: {
					replacements: [{
						pattern: /(v\d+.\d+.\d+)/,
						replacement: 'v<%= pkg.version %>'
					}]
				},
				files: {
					'ideal-image-slider.js': 'ideal-image-slider.js',
					'ideal-image-slider.css': 'ideal-image-slider.css'
				}
			}
		},

		qunit: {
			all: ['tests/**/*.html']
		},

		watch: {
			options: {
				livereload: true
			},
			dist: {
				files: ['ideal-image-slider.js'],
				tasks: ['jshint:dist','uglify','string-replace'],
				options: {
					spawn: false,
				}
			},
			extensions: {
				files: ['extensions/**/*.js'],
				tasks: ['jshint:extensions'],
				options: {
					spawn: false,
				}
			}
		}

	});

	// Plugins
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('forceOn', 'turns the --force option ON', function(){
		if ( !grunt.option( 'force' ) ) {
			grunt.config.set('forceStatus', true);
			grunt.option( 'force', true );
		}
	});
	grunt.registerTask('forceOff', 'turns the --force option OFF', function(){
		if ( grunt.config.get('forceStatus') ) {
			grunt.config.set('forceStatus', false);
			grunt.option( 'force', false );
		}
	});

	// Tasks
	grunt.registerTask('default', [
		'jshint',
		'uglify',
		'string-replace',
		'watch'
	]);

	grunt.registerTask('test', ['qunit']);

};
