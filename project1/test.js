// 모듈 등록
const express = require("express");
const db = require("./db1");

const test = express();

test.use(express.static("test"));

test.use(express.json());

test.listen(3001, () => {
  console.log('server 실행 : http://localhost:3001');
});

test.get('/usertable', async(req, res) => {
  const qry = `SELECT * FROM usertable ORDER BY 1`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('성공 usertable');
    res.send(result.rows);
  } catch(err) {
    console.log('실패 usertable');
  }
})

