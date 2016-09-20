var path = require('path'), SEP = path.sep;

module.exports = function(grunt) {
	// AWS Credentials from environment vars
	var awsKeyId = process.env.AWS_KEY;
	var awsSecretKey = process.env.AWS_SECRET;
	// buckets for upload
	var devBucket = 'teste.benito.com.br';
	var prodBucket = 'benito.com.br';

	// production list of files
	// I did not find another globbing to do this so I ended up with the solution 
	// proposed at http://stackoverflow.com/a/38679870/2726840
	var weekCache = '*(*.)css|*(*.)js';
        var yearCache = '*(*.)jpg|*(*.)jpeg|*(*.)png|*(*.)gif|*(*.)ico|*(*.)eot|*(*.)otf|*(*.)ttf|*(*.)woff|*(*.)woff2|*(*.)svg';
        var prodFiles = [
		{expand: true, cwd: 'public', src: ['**/*.!('+weekCache+'|'+yearCache+')'], dest: '/'},
		{expand: true, cwd: 'public', src: ['**/*.@('+weekCache+')'], dest: '/', stream: true, params: {CacheControl: 'max-age=604800, public'}}, // enable stream to allow large files
		{expand: true, cwd: 'public', src: ['**/*.@('+yearCache+')'], dest: '/', stream: true, params: {CacheControl: 'max-age=31536000, public'}},
	];

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
				gzipRename: 'ext',    // when uploading a gz file, keep the original extension
				//debug: true
			},
			files: prodFiles
		},
		clean_dev: {
			options: {
				bucket: devBucket,
				//debug: true // Doesn't actually delete but shows log
			},
			files: [
				{dest: '/', action: 'delete'},
			]
		},
		prod: {
			options: {
				bucket: prodBucket,
                                gzipRename: 'ext', // when uploading a gz file, keep the original extension
                                differential: true
			},
			files: prodFiles
		},
		clean_prod: {
			options: {
				bucket: prodBucket,
				debug: true // Doesn't actually delete but shows log
			},
			files: [
				{dest: '/', action: 'delete'},
			]
		}
	});

	grunt.loadNpmTasks('grunt-aws-s3');
};
