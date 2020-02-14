module.exports = {
	selectUserByUsernameAndPassword : "select * from users where username = ? and password = ?",
	insertUser: "insert into users (username, password, studentNumber, name) values ( ?, ?, ?, ? )",
	projects: require('./projects'),

	selectLectures: "select * from lectures",
	selectLecturesById : "select * from lectures where id = ?",
	selectLecturesByUserId : "select * from lectures where id in (select lecture_id from users_lectures where user_id = ? and end) ",
	selectLecturesByYear : "select * from lectures where season_year = ? and season_quarter = ?",
	selectLectures_seasonYear : "select * from lectures where season_year = ?",
	insertLectures_admin : "insert into lectures (title, description, season_year, season_quarter, lecture_type, major, class_number,class_name, score, professor) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
	selectLectures_admin : "select * from users where username = ?",
	selectLectures: "select * from lectures",
	updateEnable: "update users_lectures set enabled = 0 where user_id = ? and lecture_id = ?"
};