var express = require('express');
var router = express.Router();
const sql = require('../sql');
var db = require('../modules/db-connection-pool');

/**
 * 전체 lecture들을 조회한다.
 */
router.get("/", async function (req, res) {
    const { date } = req.query;
    const year = date ? Number(date) : (new Date()).getFullYear();
    try {
        var [rows] = await db.query(sql.selectLectures_seasonYear, [year]);
    } catch (err) {
        console.log("강의를 조회할 수 없습니다.");
    }
    res.status(200).send(rows);
});


/**
 * 특정 lecture들을 조회한다.
 * 이때 존재하지 않으면 404 error
 */
router.get("/:lecture_id*", async function (req, res) {
    const { lecture_id } = req.params;
    const [rows] = await db.query(sql.selectLecturesById, [lecture_id]);
    if (rows.length !== 1) {
        res.status(400).send({
            error: "강의를 조회할 수 없습니다."
        });
        return;
    } else {
        res.send(rows);
    }
});

/**
 * 관리자 전용 (생성)
 * req.user 봐서 user가 관리자인지 확인 후
 * lecture를 생성한다.
 * 권한이 없을 경우 401번 error
 */
router.post("/", async function (req, res) {
    if (!req.user.admin)
    {
        res.status(401).send({ error: "강좌개설 권한이 없습니다." });
        return;
    }

    const { title, description, season_year, season_quarter, lecture_type, major, class_number, class_name, score, professor } = req.body;
    console.log(title, description, season_year, season_quarter, lecture_type, major, class_number, class_name, score, professor )

    try {
        await db.query(sql.insertLectures_admin, [title, description, season_year, season_quarter, lecture_type, major, class_number, class_name, score, professor]);
    } catch(e) {
        console.log(e);
        res.status(500).send({message: "server error"});
        return;
    }

    res.send({});
});

/**
 * 관리자 전용 (수정)
 * lecutures가 없을 경우 404error
 * lecture의 값을 body를 토대로 수정한다.
 * {id, title, description, season_year ... }
 */
router.patch("/:lecture_id", async function (req, res) {
    const { lecture_id } = req.params;
    const [rows] = await db.query(sql.selectLecturesById, [lecture_id]);
    if (rows.length !== 1) {
        res.status(400).send({
            error: "강의를 조회할 수 없습니다."
        });
        return;
    } else {
        res.send(rows);
    }
});


module.exports = router;