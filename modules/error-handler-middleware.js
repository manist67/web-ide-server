function errorHandler(err, req, res, next) {
	res.status(500).send({
		msg: "에러가 나부렸다리",
		code: "500"
	});
}

module.exports = errorHandler;