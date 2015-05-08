module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist", '.tmp'],

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**', '!js/**', '!libs/**', '!**/*.css', '!**/**/*.css'], dest: 'dist/'},
                    {expand: true, flatten: true, cwd: 'src/Fonts/', src: ['*'], dest: 'dist/fonts/'}
                ]
            }
        },

        useminPrepare: {
            html: 'src/index.html'
        },

        usemin: {
            html: ['dist/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'useminPrepare', 'uglify', 'concat', 'cssmin', 'usemin'
    ]);
};
