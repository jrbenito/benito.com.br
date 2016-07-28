module.exports = function(grunt) {
    grunt.registerTask('s3-devprod-deploy', [
        'aws_s3:clean_dev',
        'aws_s3:devprod',
    ]);
};
