var express = require('express');
var router = express.Router();
var db = require('../modules/db-connection-pool');
const sql = require('../sql');


/**
 * 전체 lecture들을 조회한다.
 */
router.get("/", async function(req, res) {
	res.status(200)
	try{
		var [rows] = await db.query(sql.selectLectures, []);
		
	}
	catch(err){
		console.log("강의를 조회할 수 없습니다.")
    }
    res.send(rows);
});


/**
 * 특정 lecture들을 조회한다.
 * 이때 존재하지 않으면 404 error
 */
router.get("/:lecture_id", async function(req, res) {
 
});

/**
 * 관리자 전용 (생성)
 * req.user 봐서 user가 관리자인지 확인 후
 * lecture를 생성한다.
 * 권한이 없을 경우 401번 error
 */
router.post("/", function(req, res) {

});

/**
 * 관리자 전용 (수정)
 * lecutures가 없을 경우 404error
 * lecture의 값을 body를 토대로 수정한다.
 * {id, title, description, season_year ... }
 */
router.patch("/:lecture_id", function(req, res) {

});


module.exports = router;