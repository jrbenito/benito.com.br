module.exports = function(grunt) {
	// AWS Credentials from environment vars
	var awsKeyId = process.env.AWS_KEY;
	var awsSecretKey = process.env.AWS_SECRET;
	// buckets for upload
	var devDistribution = 'my dev cloudfron distribution ID';
	var prodDistribution = 'E1HPFWB9H7S21C';

	// production list of files
	

	grunt.config.set('cloudfront', {
		options: {
			accessKeyId: awsKeyId, // Use the variables
			secretAccessKey: awsSecretKey, // You can also use env variables
			distributionId: prodDistribution,
			invalidations: ['/*']
		},
		invalidate: {}
	});

	grunt.loadNpmTasks('grunt-aws');
};
