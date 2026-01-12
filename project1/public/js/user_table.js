// 목록 그리기 함수
function drawList(result) {
  const subject = document.querySelector('#userTable');
  subject.innerHTML = '';
  result.forEach(elem => {
    const insertHtml = `
    <tr>
    <td>${elem['USER_NO']}</td>
    <td>${elem['USER_ID']}</td>
    <td>${elem['USER_PW']}</td>
    <td>${elem['USER_NAME']}</td>
    <td>${elem['USER_TEL']}</td>
    </tr>
    `;
    subject.insertAdjacentHTML('beforeend', insertHtml);
  })
}


let userId = '';
async function init () {
	await fetch('/loginGet')
	.then(res => {
		return res.json();
	})
	.then(result => {
		if (result.length != 0) {
			userId = result[0].USER_ID;
			// console.log(userId);
			renderPage(userId);
		}
	})
	.catch(err => {
		console.log(err);
	})
}

function renderPage(userId) {
  const li1 = document.querySelector('.menu-right li:first-child'); 
  const li2 = document.querySelector('.menu-right li:last-child'); 
  li1.innerHTML = '';
  li2.innerHTML = '';
  li1.innerHTML = `<a>${userId}</a>`;
  li2.innerHTML = `<a href='/logout'>로그아웃</a>`
}
init();

// usertable 값을 데이터베이스에서 반환 받아서 이용
fetch('./usertable')
.then(resp => {
  return resp.json();
})
.then(result => {
  // console.log(result)
  drawList(result);
})
.catch (err => {
  console.log(err);
})

// 정렬 버튼(회원번호순)
// console.log(document.querySelector('.sort-container > button:first-child'));
document.querySelector('.sort-container').addEventListener('click', e => {
  // console.log(e.target);
  // console.log(e.target.classList);
  let selectClass = e.target.classList
  // 웹페이지의 버블링 속성을 이용해 이벤트 위임하는 방법
  if (selectClass.contains('sort-item')) {
    let orderBtn = e.target.innerText;
    document.querySelectorAll('.sort-item').forEach(elem => {
      elem.classList.remove('active');
    })
    selectClass.add('active');
    // console.log(orderBtn);
    fetch(`/order_user/${orderBtn}`)
    .then(res => {
      return res.json();
    })
    .then(result => {
      // console.log(result);
      drawList(result);
    })
    .catch(err => {
      console.log(err);
    })
  }
})

