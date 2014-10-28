module.exports = function (grunt) {
    grunt.initConfig({
        assemble: {
            hello: {
                options: {
                    data: 'source/data/*.{json,yml}',
                    layoutdir: 'source/templates/layouts',
                    layout: 'default.hbs',
                    partials: 'source/templates/partials/**/*.hbs',
                    collections: [
                        { name: 'navTags', inflection: 'navTag' }
                    ],
                    helpers: ['source/helpers/**/*.js']
                },
                files: [
                    { expand: true, cwd: 'source/templates/pages', src: '**/*.{hbs,md}', dest: 'output/' }
                ]
            }
        },
        clean: ['output/**'],
        connect: {
            preview: {
                options: {
                    base: ['output'],
                    port: 9000,
                    hostname: 'localhost',
                    keepalive: false,
                    livereload: 35729
                }
            }
        },
        watch: {
            templates: {
                files: ['source/templates/**/*.{hbs,md}','source/data/**/*.json','source/helpers/**/*.js'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.preview.options.livereload %>'
                },
                files: ['output/**.*']
            }
        }
    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['clean', 'assemble']);
    grunt.registerTask('server', ['build','connect','watch']);
};