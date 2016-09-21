module.exports = function(grunt) {
    grunt.registerTask('s3-cfn-files', '', function () {
	
	var files = grunt.config.get('aws_s3_changed');
	for(var i = 0, len = files.length; i < len; i++) {
		console.log(files[i]);
		files[i] = '/'+files[i];
	}
	grunt.config.set('cloudfront.options.invalidations', files);
	console.log("Invalidating Cloudfront paths: ", files);
	grunt.task.run('cloudfront:invalidate');
    });
};
