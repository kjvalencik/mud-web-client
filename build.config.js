/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
	/**
	 * The `build_dir` folder is where our projects are compiled during
	 * development and the `compile_dir` folder is where our app resides once it's
	 * completely built.
	 */
	build_dir: 'build',
	compile_dir: 'bin',

	/**
	 * This is a collection of file patterns that refer to our app code (the
	 * stuff in `src/`). These file paths are used in the configuration of
	 * build tasks. `js` is all project javascript, less tests. `ctpl` contains
	 * our reusable components' (`src/common`) template HTML files, while
	 * `atpl` contains the same, but for our app's code. `html` is just our
	 * main HTML file, `less` is our main stylesheet, and `unit` contains our
	 * app's unit tests.
	 */
	app_files: {
		js: [ 'src/**/*.js', '!src/**/*.spec.js' ],
		jsunit: [ 'src/**/*.spec.js' ],
		
		atpl: [ 'src/app/**/*.tpl.html' ],
		ctpl: [ 'src/common/**/*.tpl.html' ],

		html: [ 'src/index.html' ],
		less: 'src/less/main.less'
	},

	server_files: [ 'server/**/*.js' ],

	/**
	 * This is the same as `app_files`, except it contains patterns that
	 * reference vendor code (`vendor/`) that we need to place into the build
	 * process somewhere. While the `app_files` property ensures all
	 * standardized files are collected for compilation, it is the user's job
	 * to ensure non-standardized (i.e. vendor-related) files are handled
	 * appropriately in `vendor_files.js`.
	 *
	 * The `vendor_files.js` property holds files to be automatically
	 * concatenated and minified with our project source files.
	 *
	 * The `vendor_files.css` property holds any CSS files to be automatically
	 * included in our app.
	 */
	vendor_files: {
		js: [
			'vendor/jquery/jquery.js',
			'vendor/socket.io-client/dist/socket.io.js',
			'vendor/underscore/underscore.js',
			'src/common/underscore.mixins.js',
			'vendor/angular-unstable/angular.js',
			'vendor/angular-resource/angular-resource.js',
			'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
			'vendor/angular-ui-router/release/angular-ui-router.js',
			'vendor/angular-ui-utils/modules/route/route.js',
			'vendor/angular-ui/common/module.js',
			'vendor/angular-ui/modules/directives/if/if.js'
		],
		css: [],
		assets: [
			'vendor/bootswatch/bower_components/font-awesome/font/*.*'
		]
	},
};