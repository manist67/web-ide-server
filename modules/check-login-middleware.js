function injectUser(req, res, next) {
	next();
}

function checkLogin(req, res, next) {
	next();
}

module.exports = { injectUser, checkLogin };