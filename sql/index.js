module.exports = {
	selectUserByUsernameAndPassword : "select * from users where username = ? and password = ?",
	insertUser: "insert into users (username, password, studentNumber, name) values ( ?, ?, ?, ? )",
	selectProjects: "select * from projects",
	selectProjectById: "select * from projects where id = ?",
	insertProject: "insert into projects (user_id, name, discription, path) values( ?, ?, ?, ? )",
	selectLectures: "select * from lectures",
	updateEnable: "update users_lectures set enabled = 0 where user_id = ? and lecture_id = ?"
};