module.exports = {
	selectUserByUsernameAndPassword : "select * from users where username = ? and password = ?",
	insertUser: "insert into users (username, password, studentNumber, name) values ( ?, ?, ?, ? )",
	selectProjectById: "select * from projects where id = ?",
	insertProject: "insert into projects (user_id, name, discription, path) values( ?, ?, ?, ? )"
};