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

// fetch 기능

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

// 글쓰기 버튼 눌렀을 시 영역 
document.querySelector('.write-button').addEventListener('click', e => {
  document.querySelector('#writeArea').style.display = 'block'; 
  // = 'visible'; 
});

document.querySelector('#submitPostBtn').addEventListener('click', e => {
  const writer = document.querySelector('#writer').value;
  const title = document.querySelector('#postTitle').value;
  const content = document.querySelector('#postContent').value;
  if (!title || !content) {
    alert(`글 제목 또는 내용을 적어주세요`);
    return;
  }
  const data = {
    title,
    content,
    writer
  };
  console.log(data);
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
    drawList(result);
  })
  .catch(err => {
    console.log(err);
  })
  document.querySelector('#writeArea').style.display = 'none'

});

