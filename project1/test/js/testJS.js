// function searchMember() {
//   const input = document.getElementById("searchInput").value.toLowerCase();
//   const rows = document.querySelectorAll("#memberTable tr");

//   rows.forEach((row) => {
//     const text = row.textContent.toLowerCase();
//     row.style.display = text.includes(input) ? "" : "none";
//   });
// } // gpt가 넣어준 검색 자바스크립트

// usertable 값을 데이터베이스에서 반환 받아서 이용
fetch('./usertable')
.then(resp => {
  return resp.json();
})
.then(result => {
  result.forEach(elem => {
    console.log(elem);
    const insertHtml = `
      <tr>
        <td>${elem['USER_NO']}</td>
        <td>${elem['USER_ID']}</td>
        <td>${elem['USER_PW']}</td>
        <td>${elem['USER_NAME']}</td>
        <td>${elem['USER_TEL']}</td>
      </tr>
    `;
    const subject = document.querySelector('#userTable');
    subject.insertAdjacentHTML('beforeend', insertHtml);
  })
})