// 모듈 등록
const express = require("express");
const db = require("./db1");

const project = express();

project.use(express.static("public"));

project.use(express.json());

project.listen(3001, () => {
  console.log('server 실행 : http://localhost:3001');
});
//// 회원관리 페이지 관련
// 회원관리 목록 생성
project.get('/usertable', async(req, res) => {
  const qry = `SELECT * FROM usertable ORDER BY 1`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('성공 usertable');
    res.send(result.rows);
  } catch(err) {
    console.log(err);
    res.send(`실패 usertable`);
  }
});

//// 게시판 페이지 관련
// 게시판 목록 생성
project.get('/boardlist', async(req, res) => {
  const qry = `SELECT * FROM board_list ORDER BY 1`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('성공 boardlist');
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 boardlist`);
  }
});

// 게시판 글쓰기
project.post('/add_list', async(req, res) => {
  const {title, content, writer} = req.body;
  // console.log(title, content, writer);
  const qry = `INSERT INTO board_list (list_no, list_title, list_content, writer)
  VALUES (board_seq.nextval, :list_title, :list_content, :writer)`;

  try {
    const connection = await db.getConnection();
    await connection.execute(qry, [title, content, writer])
    await connection.commit();
    console.log('성공 add_list')
    const result = await connection.execute(`SELECT * FROM board_list ORDER BY 1`)
    // console.log(result);
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 add_list`);
  }
})

// 게시판 검색
project.get('/search_list/:search_type/:search', async(req, res) => {
  const search_type = req.params.search_type;
  const search_value = req.params.search;
  console.log(search_type, search_value);
  const search = `%${search_value.trim().toLowerCase()}%`;
  
  let qry = '';
  if (search_type == 'search_all') {
    qry = `SELECT * FROM board_list WHERE LOWER(list_title) LIKE :search OR LOWER(writer) LIKE :search ORDER BY 1`
  } else {
    // column명은 바인드를 할 수 없다
    let searchCol = `${search_type}`;
    console.log(searchCol);
    qry = `SELECT * FROM board_list WHERE LOWER(${searchCol}) LIKE :search ORDER BY 1`
  }
  // console.log(qry);

  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {search});
    // console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 searchlist`);
  }
})

//// 회원가입 페이지 관련
// 회원 가입 
project.post('/add_user', async(req, res) => {
  const {user_id, user_pw, user_name, user_tel, user_createdate} = req.body;
  const qry = `INSERT INTO usertable (user_no, user_id, user_pw, user_name, user_tel, user_createdate)
  VALUES (user_seq.nextval, :user_id, :user_pw, :user_name, NVL(:user_tel, '번호X'), :user_createdate)`;

  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {
      user_id, user_pw, user_name, user_tel, user_createdate: new Date(user_createdate)
    })
    connection.commit();
    console.log('성공 signup')
    res.json({user_id, user_pw, user_name, user_tel, user_createdate});
  } catch (err) {
    console.log(err);
    res.send(`실패 add_user`);
  }
})

// 회원 정렬
project.get('/order_user/:order', async(req, res) => {
  const order = req.params.order;
  console.log(order);
  let order_value = 0;
  switch (order) {
    case '회원번호순':
      order_value = 1;
      break;
    case '이름순':
      order_value = 4;
      break;
    default:
      res.send(`정렬 순서를 확인해주세요`);
      return;
  }
  // console.log(order_value);
  const qry = `SELECT * FROM usertable ORDER BY ${order_value}`
  // console.log(qry);
  try{
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.send(result.rows);
  } catch(err) {
    console.log(err);
    res.send(`실패 order_user`);
  }
})
