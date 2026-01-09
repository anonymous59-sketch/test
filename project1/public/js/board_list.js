fetch('./boardlist')
.then(resp => {
  return resp.json();
})
.then(result => {
  result.forEach(elem => {
    // console.log(elem);
    const insertHtml = `
      <tr>
        <td>${elem['LIST_NO']}</td>
        <td>${elem['LIST_TITLE']}</td>
        <td>${elem['LIST_CONTENT']}</td>
        <td>${elem['LIST_DATE']}</td>
      </tr>
    `;
    const subject = document.querySelector('#boardList');
    subject.insertAdjacentHTML('afterbegin', insertHtml);
  })
})
.catch (err => {
  console.log(err);
})