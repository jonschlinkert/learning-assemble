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
        },
        connect: {
            preview: {
                options: {
                    base: ['output'],
                    port: 9000,
                    hostname: 'localhost',
                    keepalive: false
                }
            }
        },
        watch: {
            templates: {
                files: ['source/templates/**/*.hbs'],
                tasks: ['assemble']
            }
        }
    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build', ['assemble']);
    grunt.registerTask('server', ['build','connect','watch']);
};