module.exports = function (grunt) {
    grunt.initConfig({
        assemble: {
            hello: {
                options: {
                    layoutdir: 'source/templates/layouts',
                    layout: 'default.hbs',
                    partials: 'source/templates/partials/**/*.hbs'
                },
                files: [
                    { expand: true, cwd: 'source/templates/pages', src: '**/*.hbs', dest: 'output/' }
                ]
            }
        }
    });
    grunt.loadNpmTasks('assemble');
};