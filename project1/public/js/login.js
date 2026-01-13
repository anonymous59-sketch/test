// 로그인 후 로그인 세션에 값 넣어두기
fetch('/loginGet')
.then(res => {
  return res.json();
})
.then(result => {
  if (result.length != 0) {
    let userId = result[0].USER_ID;
    // console.log(userId);
    alert(`환영합니다. ${userId}님`)
    window.location.href = '/index.html';
  }
})
.catch(err => {
  console.log(err);
});

// 로그인을 했을 때 로그인 정보를 화원관리 정보와 비교하기
document.querySelector('.login-box').addEventListener('submit', e => {
  e.preventDefault();
  const user_id = document.querySelector('#userId').value;
  const user_pw = document.querySelector('#userPw').value;
  if(!user_id || !user_pw) {
    alert('아이디, 비밀번호를 입력해주세요')
    if (!user_id) {
      document.querySelector('#userId').focus();
      return;
    } else {
      document.querySelector('#userPw').focus();
      return;
    }
  }
  const data = {
    user_id,
    user_pw
  }
  fetch('login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(data => {
    return data.json();
  })
  .then(result => {
    // console.log(result);
    if (result == '아이디없음') {
      alert('해당 아이디는 가입되어있지 않습니다.');
      return;
    } else if (result == '비밀번호문제') {
      alert('비밀번호를 다시 확인해주세요');
      return;
    }
    window.location.href = '/index.html';
  })
  .catch(err => {
    console.log(err);
  })
});