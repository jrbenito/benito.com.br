module.exports = function(grunt) {
    grunt.registerTask('s3-dev-deploy', [
        'aws_s3:clean_dev',
        'aws_s3:dev',
    ]);
};
