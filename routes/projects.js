var express = require('express');
var router = express.Router();

var fc = require('../modules/file-controller');
var db = require('../modules/db-connection-pool');
var randomString = require('../modules/random-string');
var compiler = require('../modules/compile-run');

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
		req.project.files = await fc.readFiles(req.project.path, true, false);
	} catch(e) {
		res.status(500).send({ type: "NoFiles", message: "파일이 존재하지 않습니다." });
		return;
	}

	res.send(req.project);
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

router.post("/:projectId", getProject, function(req, res, next) {
	const { type } = req.query;

	switch(type) {
		case "file":
			postFile(req, res);
			break;
		case "directory":
			postDirectory(req, res);
			break;
		case "delete":
			break;
		case "modify":
			modifyFile(req, res);
			break;
		case "rename":
			renameFile(req, res);
			break;
		default:
			res.status(404).send({ type: "NotFound", message: "파일이 존재하지 않습니다." });
	}
});

async function postFile(req, res) {
	const { data, name, path } = req.body;
	try {
		await fc.saveFile(data, req.project.path, path, name);
		res.send({ msg: "성공적으로 저장되었습니다." });
	} catch(e) {
		console.log(e);
		res.status(500).send({ type: "FileWrite", message: "파일 작성 실패" });
	}
}

async function postDirectory(req, res) {
	// 입력받은 path
	const { name, path } = req.body;
	try {
		await fc.createDirectory(req.project.path, path, name);

		res.send({
			msg: "성공적으로 생성되었습니다.",
			code: 1
		});
	} catch(e) {
		console.log(e);
		res.status(500).send({ type: "FileWrite", message: "폴더 생성 실패" });
	}
}

async function modifyFile(req, res) {
	const { data, path } = req.body;

	try {
		await fc.modifyFile(data, path);
	} catch(e) {
		console.log(e);
		res.status(500).send({});
		return;
	}

	res.status(200).send({});
}

async function renameFile(req, res) {
	const { path, name } = req.body;

	await fc.renameFile(path, name);
	res.send({msg: "성공"});
}

/**
 * 프로젝트 변경
 */
router.put("/:projectId", getProject,async function(req, res) {
	// TODO
	res.send({});
});

/**
 * 프로젝트 삭제
 */
router.delete("/:projectId", getProject, async function(req, res, next) {
	// TODO
	res.send({});
});


router.compile = function(io) {
	io.on('connection', function(socket) {
		socket.on('compile', async function(data) {
			const projectId = parseInt(data.projectId);
			let project;
			try {
				const [ rows ] = await db.query(sql.projects.selectProjectById, [projectId]);
				if(rows.length === 0) socket.emit("projectInfo", null);
				project = rows[0];
			} catch(e) {
				socket.emit("projectInfo", null);
				return;
			}
			
			socket.emit("projectInfo", project);

			const docker = compiler.run(project.path, project.category);
			console.log(docker);

			function emitter(data) {
				socket.emit("result", { line: data ? data.toString() : data });
			}

			docker.stdout.on("data", emitter);
			docker.stdout.on("end", emitter);
			docker.stderr.on("data", emitter);
			docker.stderr.on("end", emitter);
		});
	});
}

module.exports = router;
