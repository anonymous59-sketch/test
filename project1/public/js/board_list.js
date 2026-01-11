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

 /* async function toggleDetail(postId, rowElement) {
  // 1. 이미 열려있는 상세 창이 있다면 닫기
  const existingDetail = document.getElementById(`detail-${postId}`);
  if (existingDetail) {
      existingDetail.remove();
      rowElement.classList.remove('selected');
      return; // 토글 기능: 다시 클릭하면 닫히고 종료
  }

  // (선택사항) 다른 열려있는 상세창들을 모두 닫고 싶다면 아래 주석 해제
  // document.querySelectorAll('.detail-row').forEach(row => row.remove());

  try {
      // 2. DB에서 데이터 불러오기 (Node.js API 호출)
      const response = await fetch(`/api/board/${postId}`);
      const post = await response.json();

      // 3. 삽입할 HTML 문자열 생성 (템플릿 리터럴)
      const detailHtml = `
          <tr id="detail-${postId}" class="detail-row">
              <td colspan="4"> <!-- 테이블 전체 칸을 차지하도록 colspan 설정 -->
                  <div class="detail-container">
                      <div class="detail-header">
                          <h2 class="detail-title">${post.TITLE}</h2>
                          <div class="detail-meta">
                              <span>작성자: <strong>${post.WRITER}</strong></span> |
                              <span>작성일: ${new Date(post.REG_DATE).toLocaleString()}</span>
                          </div>
                      </div>
                      <div class="detail-content">
                          ${post.CONTENT}
                      </div>
                  </div>
              </td>
          </tr>
      `;

      // 4. 클릭한 행(rowElement) 바로 다음에 HTML 삽입
      rowElement.insertAdjacentHTML('afterend', detailHtml);

      // 5. 클릭된 행 디자인 변경
      rowElement.classList.add('selected');

  } catch (error) {
      console.error('상세 내용 로드 실패:', error);
      alert('내용을 불러올 수 없습니다.');
  } */
