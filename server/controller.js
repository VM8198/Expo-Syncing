var userModel = require('./modal');
var nodemailer = require('nodemailer');
let userController = {};
var vcardparser = require('vcardparser');
var vCardsJS = require('vcards-js');
const { exec } = require('child_process');
var cmd=require('node-cmd');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const https = require('https');


let otp = Math.floor(100000 + Math.random() * 900000)


userController.addUser = function(req,res){

	var user = new userModel(req.body);
	user.save(function(err,savedUser){
		console.log(err,savedUser);
		res.send(savedUser)
	})
console.log(req.body);
}

userController.logIn = function(req,res){
	var u_name = req.body.name;
	var pwd = req.body.password;
	userModel.find({name: u_name,password: pwd},function(err,foundUser){
		if(foundUser){
			res.send(foundUser)
		}else{
			res.send(err)
		}
	})
}

userController.sendEmail = function(req,res){

	var email = req.body.email;
	console.log("email",req.body.email);
	let transporter	= nodemailer.createTransport({
	service: 'gmail',
	secure: 'false',
	port: 25,
	auth: {
		user: 'reactNativeAppSync@gmail.com',
		pass: 'raoinfotech'
	},
	tls:{
		rejectUnauthorized: false
	}
});



let HelperOptions = {
	from: '"Sync" <reactNativeAppSync@gmail.com',
	to: email,
	subject: 'Password Recovery Email',
	text: 'Your OTP is'+otp
};

transporter.sendMail(HelperOptions, (error,info)=>{
	if(error){
		console.log(error);
	}
	console.log('success');
	console.log(info);
});

}

userController.checkOTP = function(req,res){	
	if(req.body.otp == otp){
		res.status(200).send('OK') 
	}else{
		res.status(500).send('OK') 
	}
}

userController.changePassword = function(req,res){
	var email = req.body.email;
	var password = req.body.password
		

	userModel.findOneAndUpdate({email: req.body.email},{$set:{password: req.body.password}},{upsert: true},function(err,updatedUser){
		
		if(updatedUser){
			res.status(200).send(updatedUser)
		}else{
		
			res.status(500).send(err)
		}
	});
}

userController.createFile = function(req,res){

	let name = []
	let number = []

	for(let i = 0 ; i < req.body.length ; i ++){
		name = req.body[i].name;
		number = req.body[i].number;
		var vCard = vCardsJS();
		vCard.firstName = name  
		vCard.cellPhone = number	
		vCard.saveToFile('./contacts/'+name+'.vcf');		
	}	

	cmd.get('cat ./contacts/*.vcf > ../all.vcf',function(err, data, stderr){
		console.log('done');
	}) 


	res.status(200).send();
}

module.exports = userController;
