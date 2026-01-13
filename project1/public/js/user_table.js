//// 전역변수, 데이터를 반복해서 가져오지 않고 계속 사용하기 위함
// 정렬 기준 변수
let orderIdx = 1;
// 데이터 담아두는 변수
let userInfo = [];
// 수정 중인지 아닌지 체크
let modiCheck = 0;

//// 함수
// 목록 그리기 함수
function drawList(result) {
  const subject = document.querySelector('#userTable');
  subject.innerHTML = '';
  result.forEach(elem => {
    const insertHtml = `
    <tr>
    <td>${elem['USER_NO']}</td>
    <td>${elem['AUTH']}</td>
    <td>${elem['USER_ID']}</td>
    <td>${elem['USER_PW']}</td>
    <td>${elem['USER_NAME']}</td>
    <td>${elem['USER_TEL']}</td>
    <td id="modBtn">수정</td>
    </tr>
    `;
    subject.insertAdjacentHTML('beforeend', insertHtml);
  })
}
// 멤버 등급 그리기 함수
function drawList2(result) {
  const subject = document.querySelector('#userTable');
  subject.innerHTML = '';
    const insertHtml = `
    <tr>
    <td>${result['USER_NO']}</td>
    <td>${result['AUTH']}</td>
    <td>${result['USER_ID']}</td>
    <td>${result['USER_PW']}</td>
    <td>${result['USER_NAME']}</td>
    <td>${result['USER_TEL']}</td>
    <td id="modBtn2">수정</td>
    </tr>
    `;
    subject.insertAdjacentHTML('beforeend', insertHtml);
}
//// 로그인 했을 시 세션 유지 및 첫 페이지 그리기
// 비동기 fetch를 동기로 만들기 위해 함수를 만들어 실행
async function init () {
  // 로그인 세션 받아오기
	await fetch('/loginGet')
	.then(res => {
		return res.json();
	})
	.then(result => {
		if (result.length != 0) {
      userInfo = result;
			let userId = result[0].USER_ID;
      let auth = result[0].AUTH;
			renderPage(userId, auth);
		}
	})
	.catch(err => {
		console.log(err);
	});
  // 세션 정보를 바탕으로 화면 그리기
  await fetch('./usertable')
  .then(resp => {
    return resp.json();
  })
  .then(result => {
    // console.log(result)
    if(userInfo.length == 0){
      alert(`로그인을 해주세요.`);
      window.location.href = '/login.html';
      return;
    }
    if(userInfo[0].AUTH == 'member') {
      document.querySelector('.sort-container').innerHTML = '';
      let id = [];
      result.forEach(elem => {
        if(elem.USER_ID == userInfo[0].USER_ID){
          id = elem;
        }
      })
      drawList2(id);
      return;
    }
    drawList(result);
  })
  .catch (err => {
    console.log(err);
  })

}
// 로그인 했을 시 웹페이지 부분 그리기
function renderPage(userId, auth) {
  const li1 = document.querySelector('.menu-right li:first-child'); 
  const li2 = document.querySelector('.menu-right li:last-child'); 
  li1.innerHTML = '';
  li2.innerHTML = '';
  li1.innerHTML = `<a>${userId}(${auth})</a>`;
  li2.innerHTML = `<a href='/logout'>로그아웃</a>`
}
init();
// end of 로그인 시작 페이지그리기

// 회원관리 첫 페이지 그리기(새로고침시)

//// 이벤트
// 정렬 버튼(회원번호순)
document.querySelector('.sort-container').addEventListener('click', e => {
  let selectClass = e.target.classList
  // 웹페이지의 버블링 속성을 이용해 이벤트 위임하는 방법
  if (selectClass.contains('sort-item')) {
    let orderBtn = e.target.innerText;
    // class 변경
    document.querySelectorAll('.sort-item').forEach(elem => {
      elem.classList.remove('active');
    })
    selectClass.add('active');

    fetch(`/order_user/${orderBtn}`)
    .then(res => {
      return res.json();
    })
    .then(result => {
      orderIdx = result.num;
      drawList(result.rows);
    })
    .catch(err => {
      console.log(err);
    })
  }
});

// 수정버튼
document.querySelector('#userTable').addEventListener('click', (e) => {
  if (e.target.id == "modBtn2"){
    alert('업데이트 예정입니다');
  }
  if (e.target.id == "modBtn"){
    if (userInfo.length == 0 || userInfo[0].AUTH != 'admin'){
      alert(`권한이 없습니다`);
      return;
    }
    if (modiCheck > 0){
      alert(`다른 수정사항을 저장하고 진행해주세요`)
      return;
    }
    let modRow = e.target.parentElement;
    let modContent = modRow.querySelector('td:nth-child(2)');
    let originText = modContent.innerHTML;
    
    modContent.innerHTML = `<select id="modiSel">
    <option value="admin">admin(관리자)</option>
    <option value="subAdmin">subAdmin(부관리자)</option>
    <option value="member">member(회원)</option>
    </select>`;
    // 옵션 선택시 기본 값을 현재 값으로 설정
    document.querySelector('#modiSel').value = `${originText}`;
    // 수정 중인지 체크를 위한 변수 변경
    modiCheck += 1;
    e.target.innerHTML = '확인';
    e.target.id = 'confirm'
  } else if(e.target.id == 'confirm'){
    let modRow = e.target.parentElement;
    let user_no = modRow.querySelector('td:first-child').innerText;
    let modContent = document.querySelector('#modiSel').value;
    fetch(`/userModi/${modContent}/${user_no}/${orderIdx}`)
    .then(res => {
      return res.json();
    })
    .then(result => {
      drawList(result);
    })
    .catch(err => {
      console.log(err);
    })
    // 수정 완료 변수 원상태
    modiCheck = 0;
  }

});
