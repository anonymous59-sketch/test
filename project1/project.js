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
    // console.log('성공 usertable');
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
    // console.log('성공 boardlist');
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
    // console.log('성공 add_list')
    const result = await connection.execute(`SELECT * FROM board_list ORDER BY 1`)
    // console.log(result);
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 add_list`);
  }
});

// 게시판 검색
project.get('/search_list/:search_type/:search', async(req, res) => {
  const search_type = req.params.search_type;
  const search_value = req.params.search;
  // console.log(search_type, search_value);
  const search = `%${search_value.trim().toLowerCase()}%`;
  
  let qry = '';
  if (search_type == 'search_all') {
    qry = `SELECT * FROM board_list WHERE LOWER(list_title) LIKE :search OR LOWER(writer) LIKE :search ORDER BY 1`
  } else {
    // column명은 바인드를 할 수 없다
    let searchCol = `${search_type}`;
    // console.log(searchCol);
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
});

// 게시판 내용 불러오기
project.get('/content/:list_no', async(req, res) => {
  const list_no = req.params.list_no;
  console.log(list_no);
  const qry = `SELECT * FROM board_list WHERE list_no = :list_no`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {list_no});
    // console.log('성공 content');
    // console.log(result.rows);
    res.json(result.rows);
  } catch(err) {
    console.log(err);
    res.send('실패 content');
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
    // console.log('성공 signup')
    res.json({user_id, user_pw, user_name, user_tel, user_createdate});
  } catch (err) {
    console.log(err);
    res.send(`실패 add_user`);
  }
});

// 회원 정렬
project.get('/order_user/:order', async(req, res) => {
  const order = req.params.order;
  // console.log(order);
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
    console.log(`성공 order_user`);
    res.send(result.rows);
  } catch(err) {
    console.log(err);
    res.send(`실패 order_user`);
  }
});

//// 로그인 페이지
// 로그인
project.post('/login', async(req, res) => {
  const {user_id, user_pw} = req.body;
  const qry = `SELECT * FROM usertable WHERE user_id = :user_id` 
  
  try{
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {user_id});
    console.log('성공 login');
    // console.log(result.rows);
    if (result.rows.length == 0){
      // console.log('확인');
      res.json('아이디없음');
      return;
    }
    
    const qry2 = `SELECT * FROM usertable WHERE user_id = :user_id AND user_pw = :user_pw`
    const result2 = await connection.execute(qry2, {user_id, user_pw})
    // console.log(result2.rows);
    if (result2.rows.length == 0){
      res.json('비밀번호문제');
      return;
    }
    // console.log(result2.rows[0]);
    const {USER_NO, USER_ID, USER_PW, USER_NAME, USER_TEL, USER_CREATEDATE}
    = result2.rows[0];
    console.log(USER_NO, USER_ID);
    // console.log(USER_NO, USER_ID, USER_PW, USER_NAME, USER_TEL, USER_CREATEDATE);
    const qry3 = `INSERT INTO login VALUES ('${USER_NO}', '${USER_ID}', '${USER_PW}', '${USER_NAME}')`
    await connection.execute(qry3);
    await connection.commit();
    res.json(result2);
  } catch(err) {
    console.log('실패 login', err);
  }
});

project.get('/loginGet', async(req, res) => {
  const qry = `SELECT * FROM login`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('login 성공');
    // console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log('login 실패');
    console.log(err);
  }
})

project.get('/logout', async(req, res) => {
  const qry = `DELETE FROM login`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    console.log('logout 성공');
    await connection.commit();
    // console.log(result.rows);
    res.redirect('/')
  } catch(err) {
    console.log('logout 실패');
    console.log(err);
  }
})