module.exports = function(grunt) {
	// AWS Credentials from environment vars
	var awsKeyId = process.env.AWS_KEY;
	var awsSecretKey = process.env.AWS_SECRET;

	grunt.config.set('sns', {
		options: {
			accessKeyId: awsKeyId, // Use the variables
			secretAccessKey: awsSecretKey, // You can also use env variables
			region: 'us-east-1',
		        target: 'arn:aws:sns:us-east-1:027131729208:blog-benito-travis-publishing',
		        message: 'O travis concluiu a publicação do seu blog',
		        subject: 'Blog do Benito',
		},
	});

	grunt.loadNpmTasks('grunt-aws');
};
