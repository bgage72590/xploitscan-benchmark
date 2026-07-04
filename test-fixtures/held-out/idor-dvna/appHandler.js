// Adapted from appsecco/dvna core/appHandler.js (MIT). See NOTICE.
const db = require('../models');
const bCrypt = require('bcrypt-nodejs');

module.exports.userEdit = function (req, res) {
	res.render('app/useredit', {
		userId: req.user.id,
		userEmail: req.user.email,
		userName: req.user.name
	})
}

module.exports.userEditSubmit = function (req, res) {
	db.User.find({
		where: {
			'id': req.body.id
		}
	}).then(user =>{
		if(req.body.password.length>0){
			if(req.body.password.length>0){
				if (req.body.password == req.body.cpassword) {
					user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null)
				}else{
					req.flash('warning', 'Passwords dont match')
					res.render('app/useredit', {
						userId: req.user.id,
						userEmail: req.user.email,
						userName: req.user.name,
					})
					return
				}
			}else{
				req.flash('warning', 'Invalid Password')
				res.render('app/useredit', {
					userId: req.user.id,
					userEmail: req.user.email,
					userName: req.user.name,
				})
				return
			}
		}
		user.email = req.body.email
		user.name = req.body.name
		user.save().then(function () {
			req.flash('success',"Updated successfully")
			res.render('app/useredit', {
				userId: req.body.id,
				userEmail: req.body.email,
				userName: req.body.name,
			})
		})
	})
}
