
var pool = require('../modules/db-connection-pool');

async function injectUser(req, res, next) {
	req.user = {
		id: 1, username: "2016112187", name: "김현수",
		email: "manist67@naver.com", major: "컴퓨터공학과",
		created: new Date(), updated: new Date(), admin : true
	};
	next();
	/*const conn = await pool.getConnection(async conn => conn);
	const [rows] = await conn.query();
	if(rows.length === 1) req.user = rows[0];
	next();*/
}

function checkLogin(req, res, next) {
	if(!req.user) throw {}; // TODO: error exception
	next();
}

module.exports = { injectUser, checkLogin };