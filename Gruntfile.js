module.exports = function (grunt) {
    grunt.initConfig({
        assemble: {
            hello: {
                files: [
                    {
                        expand: true,
                        cwd: 'source/templates/pages',
                        src: '**/*.hbs',
                        dest: 'output/'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('assemble');
};