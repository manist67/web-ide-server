var express = require('express');
var router = express.Router();

var fc = require('../modules/file-controller');
var db = require('../modules/db-connection-pool');
var randomString = require('../modules/random-string');

const sql = require('../sql');

/**
 * project 객체 생김세 
 * {
 * 		id: 0, 
 * 		name:"프로젝트 5",
 *  	language: "c",
 * 		createdAt: "2020-01-27T14:35:13.000Z",
 * 		files?: []
 * },
 */

/**
 * req.project에 project를 삽입해주는 api
 * @param {Request} req 
 * @param {Response} res 
 */
async function getProject(req, res, next) {
	const projectId = parseInt(req.params.projectId);
	let project;
	try {
		const [ rows ] = await db.query(sql.projects.selectProjectById, [projectId]);
		if(rows.length !== 1) {
			res.status(404).send({type: "NoData", message: "프로젝트가 존재하지 않습니다."}); 
			return;
		}
		project = rows[0];
	} catch(e) {
		res.status(500).send({ type: "NoFiles", message: "파일이 존재하지 않습니다." });
		return;
	}

	req.project = project;
	next();
}

router.get("/", async function(req, res) {
	const [rows] = await db.query(sql.projects.selectProjects, []);
	res.send(rows);
});

router.get("/:projectId", getProject, async function(req, res) {
	try {
		result.files = await fc.readFiles(req.project.path, true, false);
		console.log(req.project.path);
	} catch(e) {
		res.status(500).send({ type: "NoFiles", message: "파일이 존재하지 않습니다." });
		return;
	}

	res.send(result);
});

router.get("/:projectId/:path*", getProject, async function(req, res) {
	const path = req.params.path + req.params[0];
	const result = await fc.readFileInfo([req.project.path, path], { readSubDir: files === "true", onlyDirs: dirs === "true"});
	
	res.send(result);
});


router.post("/", async function(req, res, next) {
	const { id } = req.user;
	const { name, category } = req.body;
	const random_path = randomString(20);

	if(!name) { res.status(400).send({ type: "NoBody", message: "name이 없습니다."}); return; }
	if(!category) { res.status(400).send({ type: "NoBody", message: "category가 없습니다."}); return; }

	try { 
		await fc.createDirectory(random_path);
	} catch(e) {
		res.status(500).send(e);
		return;
	}

	let result;
	try {
		[ result ] = await db.query(sql.projects.insertProject, [id, name, category, random_path]);
	} catch(e) {
		console.log(e);
		res.status(500).send({ type: "DBConnection", message: "데이터 베이스 접속 실패" });
		return;
	}

	res.send({ id: result.insertId });
});

router.post("/:projectId/:path*", getProject, function(req, res, next) {
	if(req.query.type == "file") { postFile(req, res, next); return; } // 파일 업로드일 시 다음 hanlder로 넘김
	if(req.query.type == "directory") { postDirectory(req, res, next); return; } // 디렉토리일 시 파일 생성

	// 이외의 경우 404 status 를 response 해준다.
	res.status(404).send({ type: "NoData", message: "파일이 존재하지 않습니다." });
});

async function postFile(req, res, next) {
	// 입력받은 path
	let dest = "";
	if(req.params.path)
		dest = req.params.path + req.params[0];

	try {
		await fc.saveFile(req.file.buffer, dest, req.file.originalname);
		res.send({
			msg: "성공적으로 저장되었습니다.",
			code: 1
		});
	} catch(e) {
		next(e); return;
	}
}

async function postDirectory(req, res, next) {
	// 입력받은 path
	let dest = "";
	if(req.params.path)
		dest = req.params.path + req.params[0];

	if(!dest) {
		// 경로가 존재하지 않을 경우 404 오류를 발송한다
		res.status(404).send({
			msg: "목적지 없음",
			code: -1
		});
		return;
	}

	try {
		await fc.createDirectory(dest);

		res.send({
			msg: "성공적으로 생성되었습니다.",
			code: 1
		});
	} catch(e) {
		next(e); return;
	}
}

/**
 * 프로젝트 변경
 */
router.put("/:projectId", getProject,async function(req, res) {
	// TODO
	res.send({});
});

/**
 * 파일 이름 변경
 */
router.put("/:projectId/:path*", async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;

	const path = req.params.path + req.params[0];

	await fc.renameFile(path, req.body.name);
	res.send({msg: "성공"});
});

/**
 * 프로젝트 삭제
 */
router.delete("/:projectId", async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;

	/**
	 * TODO: project 삭제
	 */
});

/**
 * 파일을 삭제한다.
 */
router.delete("/:projectId/:path*",getProject, async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const path = req.params.path + req.params[0];

	try {
		await fc.removeFile(path, req.body.name);
	} catch(e) {
		next(e); return;
	}

	res.send({msg: "성공"});
});



module.exports = router;
