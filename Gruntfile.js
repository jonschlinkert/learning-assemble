module.exports = function (grunt) {
    grunt.initConfig({
        api : grunt.file.readJSON('source/data/api.json'),
        assemble: {
            hello: {
                options: {
                    data: 'source/data/*.{json,yml}',
                    layoutdir: 'source/templates/layouts',
                    layout: 'default.hbs',
                    partials: 'source/templates/partials/**/*.hbs',
                    collections: [
                        { name: 'navTags', inflection: 'navTag' },
                        { name: 'posts', inflection: 'post', sortby: 'posted', sortorder: 'desc' }
                    ],
                    helpers: ['source/helpers/**/*.js'],
                    plugins: ['assemble-middleware-sitemap'],
                    sitemap: {
                        homepage: "http://awesome-site.bogus",
                        relativedest: true,
                        exclude: ['diagnostics'],
                        changefreq: 'monthly'
                    }
                },
                files: [
                    { expand: true, cwd: 'source/templates/pages', src: ['**/*.{hbs,md}', '!api-index.hbs'], dest: 'output/' }
                ]
            },
            api: {
                options: {
                    flatten: true,
                    layout: 'source/templates/layouts/api-layout.hbs',
                    pages: '<%= api.pages %>'
                }
                ,
                files: {
                  'output/api/': ['source/templates/pages/api-index.hbs']
                }
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