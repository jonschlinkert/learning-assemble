module.exports = function (grunt) {
    grunt.initConfig({
        assemble: {
            hello: {
                files: {
                    'output/': ['index.hbs']
                }
            }
        }
    });
    grunt.loadNpmTasks('assemble');
};