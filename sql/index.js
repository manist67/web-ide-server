module.exports = {
	selectUserByUsernameAndPassword : "select * from users where username = ? and password = ?",
	insertUser: "insert into users (username, password, studentNumber, name) values ( ?, ?, ?, ? )",
	projects: require('./projects')
};