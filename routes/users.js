var express = require('express');
var router = express.Router();

// router.get('/', function(req, res) {});
var db = require('../modules/db-connection-pool');
var sql = require('../sql');

/**
 * 해당 user의 lecture들만 조회한다. 
 * 이때 lecture_users의 enabled 값도 같이 줘야함
 * 이때 자기 id혹은 관리자일 경우는 조회에 성공하고 (status: 200)
 * 아닐경우에 403번 error
 */
router.get("/:user_id/lectures", async function(req, res) { 

});


/**
 * 관리자가 허락해줄 경우 lecture_users를 enabled를 true
 * users_lectures_id가 없을 경우 404error
 * users_lectures_id가 이미 enabled: true 된 경우 false로 바꿔준다.
 */
router.put("/:user_id/lectures/:lecture_id", async function(req, res) {
	var userID = req.params.user_id;
	var lectureID = req.params.lecture_id;
	const [rows] = await db.query(sql.updateEnable, [userID, lectureID]);
	
	console.log(rows);
	res.send({
		code: 100,
		msg: "등록 성공"
	});
});

router.post('/', async function(req, res) {
	const { username, password, studentNumber, name } = req.body;
	const conn = await db.getConnection(async conn => conn);
	await conn.query(sql.insertUser, [username, password, studentNumber, name]);

	res.send({
		code: 100,
		msg: "회원가입 성공"
	});
})

module.exports = router;
