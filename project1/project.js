// 모듈 등록
const express = require("express");
const db = require("./db1");

const project = express();

project.use(express.static("public"));

project.use(express.json());

project.listen(3001, () => {
  console.log('server 실행 : http://localhost:3001');
});

project.get('/usertable', async(req, res) => {
  const qry = `SELECT * FROM usertable ORDER BY 6`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('성공 usertable');
    res.send(result.rows);
  } catch(err) {
    console.log('실패 usertable');
  }
});

project.get('/boardlist', async(req, res) => {
  const qry = `SELECT * FROM board_list ORDER BY 4`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('성공 boardlist');
    res.send(result.rows);
  } catch (err) {
    console.log('실패 baoardlist');
  }
});

project.post('/add_user', async(req, res) => {
  const {user_id, user_pw, user_name, user_tel, user_createdate} = req.body;
  const qry = `INSERT INTO usertable (user_id, user_pw, user_name, user_tel, user_createdate)
  VALUES (:user_id, :user_pw, :user_name, :user_tel, :user_createdate)`;

  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, [
      user_id, user_pw, user_name, user_tel, new Date(user_createdate)
    ])
    connection.commit();
    console.log('성공 signup')
    res.json({user_id, user_pw, user_name, user_tel, user_createdate});
  } catch (err) {
    console.log(err);
  }
})



