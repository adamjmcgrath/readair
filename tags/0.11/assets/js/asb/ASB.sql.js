////////////////////////////////////////////////////////////////////
// ASB.sql
////////////////////////////////////////////////////////////////////

if (typeof ASB == "undefined") {var ASB = {};}

(function() {
	if(!window.ASB.sql) { window["ASB"]["sql"] = {} }

	// Globals
	var dbConn;
	var sqlStmt;

	// Connect to DB
	function connectToDB(pathToDB) {
		dbConn = new air.SQLConnection();
		dbConn.addEventListener(air.SQLEvent.OPEN, dbOpenSuccess);
		dbConn.addEventListener(air.SQLErrorEvent.ERROR, dbOpenFailure);
		// access/create db file: "/data/gra.db"
		var dbFile = air.File.applicationStorageDirectory.resolvePath(pathToDB);
		dbConn.openAsync(dbFile);
	}
	
	function dbOpenSuccess() {
		air.trace("Success!");
	}
		
	function dbOpenFailure() {
		air.trace("Fail!");
	}
	
	// Create/Access table

	function createTable(tableName) {
		var sql = "";
		sql += "CREATE TABLE IF NOT EXISTS " + tableName + " ( ";
		sql += "empId INTEGER PRIMARY KEY AUTOINCREMENT, ";
		sql += "firstName TEXT, ";
		sql += "lastName TEXT, ";
		sql += "salary NUMERIC CHECK (salary >= 0) DEFAULT 0";
		sql += ")";
	}
	
	function viewTable(tableName) {
		var sql = "";
		sql += "SELECT * FROM " + tableName;
	}

	// Utils

	function executeSqlStmt(sql){
		sqlStmt = new air.SQLStatement();
		sqlStmt.sqlConnection = conn;
		sqlStmt.text = sql;
		try {
			sqlStmt.execute();
		} catch (e) {
			air.trace("INSERT error:", e);
			air.trace("error.message:", e.message);
			air.trace("error.details:", e.details);
		}
	}
	
	window["ASB"]["sql"]["connectToDB"] = connectToDB;
	window["ASB"]["sql"]["createTable"] = createTable;
	window["ASB"]["sql"]["viewTable"] = viewTable;
	
})()