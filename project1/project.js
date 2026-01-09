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
  const qry = `SELECT * FROM usertable ORDER BY 1`
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
  const qry = `SELECT * FROM board_list ORDER BY 1`
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
  const qry = `INSERT INTO usertable (user_no, user_id, user_pw, user_name, user_tel, user_createdate)
  VALUES (user_seq.nextval, :user_id, :user_pw, :user_name, NVL(:user_tel, '번호X'), :user_createdate)`;

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
    res.send(`오류가 발생했습니다.`);
  }
})

project.post('/add_list', async(req, res) => {
  const {title, content, writer} = req.body;
  console.log(title, content, writer);
  const qry = `INSERT INTO board_list (list_no, list_title, list_content, writer)
  VALUES (board_seq.nextval, :list_title, :list_content, :writer)`;

  try {
    const connection = await db.getConnection();
    await connection.execute(qry, [title, content, writer])
    await connection.commit();
    console.log('성공 add_list')
    const result = await connection.execute(`SELECT * FROM board_list ORDER BY 1`)
    console.log(result);
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`오류가 발생했습니다.`);
  }
})

