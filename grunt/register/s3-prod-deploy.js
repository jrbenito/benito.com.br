module.exports = function(grunt) {
    grunt.registerTask('s3-prod-deploy', [
        'aws_s3:prod',
	's3-cfn-files',
    ]);
};
