var express = require('express');
var router = express.Router();

/**
 * 전체 lecture들을 조회한다.
 */
router.get("/", function(req, res) {

});


/**
 * 특정 lecture들을 조회한다.
 * 이때 존재하지 않으면 404 error
 */
router.get("/:lecture_id", function(req, res) {

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