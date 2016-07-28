module.exports = function(grunt) {
	// AWS Credentials from environment vars
	var awsKeyId = process.env.AWS_KEY;
	var awsSecretKey = process.env.AWS_SECRET;
	// buckets for upload
	var devBucket = 'teste.benito.com.br';
	var prodBucket = 'my-wonderful-production-bucket';

	grunt.config.set('aws_s3', {
		options: {
			accessKeyId: awsKeyId, // Use the variables
			secretAccessKey: awsSecretKey, // You can also use env variables
			region: 'us-east-1',
			uploadConcurrency: 8, // 5 simultaneous uploads
			downloadConcurrency: 8 // 5 simultaneous downloads
		},
		dev: {
			options: {
				bucket: devBucket,
				differential: true, // Only uploads the files that have changed
				gzipRename: 'ext' // when uploading a gz file, keep the original extension
			},
			files: [
				{expand: true, cwd: 'public', src: ['**'], dest: '/'},
			]
		},
		devprod: {
			options: {
				bucket: devBucket,
				differential: false, // Only uploads the files that have changed
				gzipRename: 'ext' // when uploading a gz file, keep the original extension
			},
			files: [
				{expand: true, cwd: 'public', src: ['**'], dest: '/'},
			]
		},
		clean_dev: {
			options: {
				bucket: devBucket,
				//debug: true // Doesn't actually delete but shows log
			},
			files: [
				{dest: '/', action: 'delete'},
				//{dest: 'assets/', exclude: "**/*.tgz", action: 'delete'}, // will not delete the tgz
				//{dest: 'assets/large/', exclude: "**/*copy*", flipExclude: true, action: 'delete'}, // will delete everything that has copy in the name
			]
		},
		prod: {
			options: {
				bucket: prodBucket,
			},
			files: [
				{expand: true, cwd: 'public', src: ['*'], dest: '/'},
//				{expand: true, cwd: assetsPublic, src: ['**'], dest: 'assets/', stream: true, params: {CacheControl: 'max-age=604800, public'}}, // enable stream to allow large files
//				{expand: true, cwd: 'public', src: ['icon'+ SEP +'**','images'+ SEP +'**'], dest: '/', params: {CacheControl: 'max-age=31536000, public'}},
				// CacheControl only applied to the assets and images folder
			]
		},
		clean_prod: {
			options: {
				bucket: prodBucket,
				debug: true // Doesn't actually delete but shows log
			},
			files: [
				{dest: '/', action: 'delete'},
				//{dest: 'assets/', exclude: "**/*.tgz", action: 'delete'}, // will not delete the tgz
				//{dest: 'assets/large/', exclude: "**/*copy*", flipExclude: true, action: 'delete'}, // will delete everything that has copy in the name
			]
		}
	});

	grunt.loadNpmTasks('grunt-aws-s3');
};
