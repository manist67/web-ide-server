var express = require('express');
var router = express.Router();

// router.get('/', function(req, res) {});
var pool = require('../modules/db-connection-pool');
var sql = require('../sql');

router.post('/', async function(req, res) {
	const { username, password, studentNumber, name } = req.body;
	const conn = await pool.getConnection(async conn => conn);
	await conn.query(sql.insertUser, [username, password, studentNumber, name]);

	res.send({
		code: 100,
		msg: "회원가입 성공"
	});
})

module.exports = router;
