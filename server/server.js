// var exp = require('express');
// var mongoose = require('mongoose');
// var userController = require('./controller');
// var bodyParser = require('body-parser');
// var app = exp();
// mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true})
// .then(() => console.log("Connected"))
// .catch(err => console.log(err));

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

// app.post('/user/signup',userController.addUser);
// app.get('/user/login',userController.logIn);
// app.post('/user/sendEmail',userController.sendEmail)
// app.post('/user/checkOTP',userController.checkOTP)
// app.post('/user/changePassword',userController.changePassword)
// app.post('/user/createFile',userController.createFile)
// app.listen(4000);
var request = require('request');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


request.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {

	header: {
		"Content-Type": '*/*',
		'Content-Length': '50000',
		'Authorization' : 'Bearer ya29.GlvmBknRI63QfcloWR78VhtmbcGdQ10h8H-xWZ7HNs3dERQVBpdB3TF9eR4dCAIZJTf1tNjQBpOEIUp5WdobIlYn9Bmy_Z76hDaU8PJejkq16v6a3K1Pus8G64HC' 
	}

},function(req,res){

	const drive = google.drive({
		version: 'v3',		
	});

	var fileMetadata = {
		'name': 'all.vcf'
	};

	var media = {
		Type: '*/vcf',
		body: fs.createReadStream('all.vcf')
	};
	
	drive.files.create({
		resource: fileMetadata,
		media: media,
		fields: 'id'
	}, function (err, file) {
		if (err) {
			console.log("creation",err);
		} else {
			console.log('File Id: ', file.id);
		}
	});
	console.log(res);
});

// reactNativeAppSync@gmail.com


