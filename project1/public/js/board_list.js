////함수
// 글자 수 제한 함수
function trucText (text){
  let maxlength = 7;
  if(text.length > maxlength) {
    return text.substring(0, maxlength - 3) + '...';
  }
  return text;
}
// 목록 그리기 함수
function drawList(result) {
    const subject = document.querySelector('#boardList');
    subject.innerHTML = '';
     result.forEach(elem => {
    const title = trucText(elem['LIST_TITLE']);
    const writer = trucText(elem['WRITER']);

    const insertHtml = `
      <tr>
        <td>${elem['LIST_NO']}</td>
        <td>${title}</td>
        <td>${writer}</td>
        <td>${elem['LIST_DATE']}</td>
      </tr>
    `;
    subject.insertAdjacentHTML('afterbegin', insertHtml);
  })
}

// //fetch 기능
// 페이지 들어오면 목록 그리기
fetch('./boardlist')
.then(resp => {
  return resp.json();
})
.then(result => {
  // console.log(result);
  drawList(result);
})
.catch (err => {
  console.log(err);
})

// 글쓰기 버튼 눌렀을 시 영역 보이기
document.querySelector('.write-button').addEventListener('click', e => {
  document.querySelector('#writeArea').style.display = 'block'; 
  document.querySelector('#writer').focus();
});

// 글쓰기 등록버튼 이벤트
document.querySelector('#submitPostBtn').addEventListener('click', e => {
  const writer = document.querySelector('#writer').value;
  const title = document.querySelector('#postTitle').value;
  const content = document.querySelector('#postContent').value;
  // 글 제목과 내용이 없으면 경고
  if (!title || !content) {
    alert(`글 제목 또는 내용을 적어주세요`);
    return;
  }
  // 글 제목, 내용, 작성자 데이터 넘기기
  const data = {
    title,
    content,
    writer
  };
  // console.log(data);

  // 데이터 베이스 값 받아와서 목록에 그리기
  fetch('add_list', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(data => {
    return data.json();
  })
  .then(result => {
    // 목록 그리기
    drawList(result);
    document.querySelector('.search-select').value = 'search_all';
    document.querySelector('.search-input').value = '';
  })
  .catch(err => {
    console.log(err);
  })

  // 글쓰기 창 자동 닫기 및 입력 된 값 초기화
  document.querySelector('#writeArea').style.display = 'none'
  document.querySelectorAll('.write-form input').forEach(elem => elem.value = '');
  document.querySelector('#postContent').value = '';
});

// 글쓰기 취소버튼
document.querySelector('#cancelPostBtn').addEventListener('click', e => {
  document.querySelectorAll('.write-form input').forEach(elem => elem.value = '');
  document.querySelector('#postContent').value = '';
});

// 검색창 이벤트
document.querySelector('.search-form').addEventListener('submit', e => {
  e.preventDefault();
  const search_type = document.querySelector('.search-select').value;
  const search = document.querySelector('.search-input').value;
  // console.log(search_type, search);
  fetch(`/search_list/${search_type}/${search}`)
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
})
