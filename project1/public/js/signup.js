// 회원가입 submit 시 시스템 날짜 자동 추가
const form = document.getElementById('signupForm');

form.addEventListener('submit', (e) => {
  // 현재 날짜
  // const today = new Date();
  // const yyyy = today.getFullYear();
  // const mm = String(today.getMonth() + 1).padStart(2, '0');
  // const dd = String(today.getDate()).padStart(2, '0');
  // const user_createdate = `${yyyy}-${mm}-${dd}`;
  e.preventDefault();
  const user_id = document.querySelector('#userId').value;
  const user_pw = document.querySelector('#password').value;
  const user_name = document.querySelector('#name').value;
  const user_tel = document.querySelector('#phone').value;
  const user_createdate = new Date();
  
  if(!user_id || !user_pw || !user_name) {
    alert('필수 값 입력');
    return;
  } else if(user_tel.length > 15) {
    alert('전화번호를 15자리까지 입력하십시오.')
    document.querySelector('#phone').focus();
    return;
  }
  const data = {
    user_id,
    user_pw,
    user_name,
    user_tel,
    user_createdate
  };
  fetch('add_user',{
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
    window.location.href = 'index.html';
  })
});

