// 데이터 베이스에서 받아온 데이터를 담아둘 변수
// 페이징 할 때 데이터 참조 방법 
let arrayData = [];
let maxList = document.querySelector('#pageSizeSelect').value;
////함수
// 글자 수 제한 함수
function trucText (text){
  let maxlength = 7;
  if(text.length > maxlength) {
    return text.substring(0, maxlength - 3) + '...';
  }
  return text;
} // end of trucText fnc.

// 목록 그리기 함수
function drawList(result) {
    const subject = document.querySelector('#boardList');
    subject.innerHTML = '';
    result.forEach(elem => {
    const title = trucText(elem['LIST_TITLE']);
    const writer = trucText(elem['WRITER']);

    const insertHtml = `
      <tr id = 'boardRow' data-bno = '${elem['LIST_NO']}'>
        <td>${elem['LIST_NO']}</td>
        <td>${title}</td>
        <td>${writer}</td>
        <td>${elem['LIST_DATE']}</td>
      </tr>
    `;
    subject.insertAdjacentHTML('afterbegin', insertHtml);
  })
} // end of drawList fnc.

// 글 내용 그리기 함수
function drawContent(result, row){
  // data-bno == bno 밑에 그려야함
  // console.log(row);
  const listNo = row.dataset.bno;
  const selectRow = document.querySelector(`#detail-${listNo}`);
  
  // 목록을 한 번 더 눌렀을 시 원상태
  if (selectRow){
    selectRow.remove();
    row.classList.remove('selected');
    return;
  }
  
  // 클릭 외 다른 내용 닫기 및 클래스 제거
  document.querySelectorAll('.detail-row').forEach(elem => elem.remove());
  document.querySelectorAll('#boardRow').forEach(elem => elem.classList.remove('selected'));

  result.forEach(elem => {
    const insertHtml = `
      <tr id="detail-${elem['LIST_NO']}" class="detail-row">
        <td colspan="4">
          <div class="detail-container">
            <div class="detail-header">
              <h2 class="detail-title">${elem['LIST_TITLE']}</h2>
                <div class="detail-meta">
                  <span>작성자: <strong>${elem['WRITER']}</strong></span> |
                  <span>작성일: ${elem['LIST_DATE']}</span>
                </div>
            </div>
            <div class="detail-content">${elem['LIST_CONTENT']}</div>
          </div>
        </td>
      </tr>
    `
    row.insertAdjacentHTML('afterend', insertHtml)
  })
  row.classList.add('selected');
}// end of drawContent fnc

// 페이징을 위해 불러온 데이터를 가공하는 함수
function paging(data, nowPage = 1, maxRow = 5) {
  const start = data.length - (nowPage * maxRow);
  const end = data.length - ((nowPage -1) * maxRow);
  const pageData = data.slice(Math.max(start, 0), end);
  return pageData;
}

// 페이징 번호 표현을 위한 함수
function pageNumber(data, maxRow = 5){
  const pageMaxNum = Math.ceil(data.length / maxRow);
  let numPgContainer = document.querySelector('#numPg');
  numPgContainer.innerHTML = '';
  // console.log(pageMaxNum);
  for(let i = 1; i <= pageMaxNum; i++) {
    let page = document.createElement('span');
    let pageNo = `${i} `;
    page.innerHTML = pageNo;
    page.classList.add('pageNo');
    page.setAttribute('data-pno', i);
    numPgContainer.appendChild(page);
  }

}

//// 전역 fetch 기능
// 페이지 들어오면 목록 그리기
fetch('./boardlist')
.then(resp => {
  return resp.json();
})
.then(result => {
  // console.log(result);
  arrayData = result;
  maxList = document.querySelector('#pageSizeSelect').value;
  pageNumber(result, maxList);
  let pageData = paging(result, undefined, maxList);
  drawList(pageData);
})
.catch (err => {
  console.log(err);
})

//// 이벤트
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
    arrayData = result;
    document.querySelector('.search-select').value = 'search_all';
    document.querySelector('.search-input').value = '';
    maxList = document.querySelector('#pageSizeSelect').value;
    pageNumber(result, maxList);
    let pageData = paging(result, undefined, maxList);
    drawList(pageData);
  })
  .catch(err => {
    console.log(err);
  })

  // 글쓰기 창 자동 닫기 및 입력 된 값 초기화
  document.querySelector('#writeArea').style.display = 'none'
  document.querySelectorAll('.write-form input').forEach(elem => elem.value = '');
  document.querySelector('#postContent').value = '';
}); // end of writeBtn event

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
    arrayData = result;
    // console.log(result);
    maxList = document.querySelector('#pageSizeSelect').value;
    pageNumber(result, maxList);
    let pageData = paging(result, undefined, maxList);
    drawList(pageData);
  })
  .catch(err => {
    console.log(err);
  })
}) // end of search event

// 글 목록 클릭 이벤트
document.querySelector('#boardList').addEventListener('click', e => {
  let event = e.target.parentElement;
  // console.log(event.dataset.bno);
  // console.log(event.id);
  // console.log(event);
  let bno = event.dataset.bno;
  // let row = event;
  if (event.id == 'boardRow')
  fetch(`/content/${bno}`)
  .then(res => {
    return res.json();
  })
  .then(result => {
    // console.log(result);
    drawContent(result, event);
  })
  .catch(err => {
    console.log(err);
  })
});

let pageNum = document.querySelector('#numPg')
pageNum.addEventListener('click', e => {
  document.querySelectorAll('.pageNo').forEach(elem => elem.classList.remove('selectedSpan'))
  if (e.target.classList.contains('pageNo')) {
    const number = e.target.dataset.pno;
    // console.log(number);
    maxList = document.querySelector('#pageSizeSelect').value;
    console.log(maxList);
    let pageData = paging(arrayData, number, maxList);
    drawList(pageData);
    // console.log(e.target);
    e.target.classList.add('selectedSpan')
  } 
});

document.querySelector('#pageSizeSelect').addEventListener('change', e => {
  // console.log(e.target.value);
  const listNumber = e.target.value;
  const number = pageNum.dataset.pno;
  pageNumber(arrayData, listNumber);
  let pageData = paging(arrayData, number, listNumber);
  drawList(pageData);
})
