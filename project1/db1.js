const oracledb1 = require("oracledb");

oracledb1.outFormat = oracledb1.OUT_FORMAT_OBJECT;

const dbconfig = {
  user: "testUser",
  password: "test",
  connectString: "localhost:1521/xe",
};

async function getConnection() {
  try {
    const connection = await oracledb1.getConnection(dbconfig);
    return connection;
  } catch(err) {
    return err;
  }
}
module.exports = {getConnection};