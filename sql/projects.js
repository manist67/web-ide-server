module.exports = {
    selectProjects: "select * from projects",
	selectProjectById: "select * from projects where id = ?",
	insertProject: "insert into projects (user_id, name, category, path) values( ?, ?, ?, ? )"
}