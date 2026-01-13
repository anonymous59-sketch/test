//// 모듈 등록
const express = require("express");
const db = require("./db1");

const project = express();

project.use(express.static("public"));

project.use(express.json());

// 서버 연결
project.listen(3000, () => {
  console.log('server 실행 : http://localhost:3000');
});


//// 회원관리 페이지 관련
// 회원관리 목록 생성
project.get('/usertable', async(req, res) => {
  const qry = `SELECT * FROM usertable ORDER BY 1`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.send(result.rows);
  } catch(err) {
    console.log(err);
    res.send(`실패 usertable`);
  }
});

// 회원 정렬
project.get('/order_user/:order', async(req, res) => {
  const order = req.params.order;
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
  const qry = `SELECT * FROM usertable ORDER BY ${order_value}`
  try{
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.send({rows: result.rows, num: order_value});
  } catch(err) {
    console.log(err);
    res.send(`실패 order_user`);
  }
});

// 회원관리 수정
project.get('/userModi/:auth/:user_no/:orderIdx', async(req, res) => {
  const auth = req.params.auth;
  const user_no = req.params.user_no;
  const orderIdx = req.params.orderIdx;
  const qry = `UPDATE usertable SET auth = :auth WHERE user_no = :user_no `
  try {
    const connection = await db.getConnection();
    await connection.execute(qry, {auth, user_no});
    await connection.commit();
    const result = await connection.execute(`SELECT * FROM usertable ORDER BY ${orderIdx}`);
    res.json(result.rows);
  } catch (err) {
    console.log('userModi 오류');
    console.log(err);
  }
})

//// 게시판 페이지 관련
// 게시판 목록 생성
project.get('/boardlist', async(req, res) => {
  const qry = `SELECT * FROM board_list ORDER BY 1`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 boardlist`);
  }
});

// 게시판 글쓰기
project.post('/add_list', async(req, res) => {
  const {title, content, writer} = req.body;
  const qry = `INSERT INTO board_list (list_no, list_title, list_content, writer)
  VALUES (board_seq.nextval, :list_title, :list_content, :writer)`;

  try {
    const connection = await db.getConnection();
    await connection.execute(qry, [title, content, writer])
    await connection.commit();
    const result = await connection.execute(`SELECT * FROM board_list ORDER BY 1`)
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
  const search = `%${search_value.trim().toLowerCase()}%`;
  
  let qry = '';
  if (search_type == 'search_all') {
    qry = `SELECT * FROM board_list WHERE LOWER(list_title) LIKE :search OR LOWER(writer) LIKE :search ORDER BY 1`
  } else {
    // column명은 바인드를 할 수 없다
    let searchCol = `${search_type}`;
    qry = `SELECT * FROM board_list WHERE LOWER(${searchCol}) LIKE :search ORDER BY 1`
  }
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {search});
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send(`실패 searchlist`);
  }
});

// 게시판 내용 불러오기
project.get('/content/:list_no', async(req, res) => {
  const list_no = req.params.list_no;
  const qry = `SELECT * FROM board_list WHERE list_no = :list_no`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, {list_no});
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
  const qry2 = `SELECT * FROM usertable WHERE user_id = '${user_id}'`;
  try {
    const connection = await db.getConnection();
    const confirmId = await connection.execute(qry2);
    if (confirmId.rows[0]){
      res.json('아이디중복')
      return;
    }
    const result = await connection.execute(qry, {
      user_id, user_pw, user_name, user_tel, user_createdate: new Date(user_createdate)
    })
    connection.commit();
    res.json({user_id, user_pw, user_name, user_tel, user_createdate});
  } catch (err) {
    console.log(err);
    res.send(`실패 add_user`);
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
    if (result.rows.length == 0){
      res.json('아이디없음');
      return;
    }
    
    const qry2 = `SELECT * FROM usertable WHERE user_id = :user_id AND user_pw = :user_pw`
    const result2 = await connection.execute(qry2, {user_id, user_pw})
    if (result2.rows.length == 0){
      res.json('비밀번호문제');
      return;
    }
    const {USER_NO, USER_ID, USER_PW, USER_NAME, USER_TEL, USER_CREATEDATE, AUTH}
    = result2.rows[0];
    const qry3 = `INSERT INTO login VALUES ('${USER_NO}', '${USER_ID}', '${USER_PW}', '${USER_NAME}', '${AUTH}')`
    await connection.execute(qry3);
    await connection.commit();
    res.json(result2);
  } catch(err) {
    console.log('실패 login', err);
  }
});

// 로그인 세션 불러오기
project.get('/loginGet', async(req, res) => {
  const qry = `SELECT * FROM login`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.json(result.rows);
  } catch (err) {
    console.log('login 실패');
    console.log(err);
  }
})

// 로그아웃, 로그인 세션 데이터 삭제
project.get('/logout', async(req, res) => {
  const qry = `DELETE FROM login`
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    await connection.commit();
    res.redirect('/')
  } catch(err) {
    console.log('logout 실패');
    console.log(err);
  }
})