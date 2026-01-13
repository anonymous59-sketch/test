// 로그인 세션에서 정보 가져오기, 세션에 정보 없으면 실행 안됨 
function init () {
	fetch('/loginGet')
	.then(res => {
		return res.json();
	})
	.then(result => {
		if (result.length != 0) {
			let userId = result[0].USER_ID;
      let auth = result[0].AUTH;
			renderPage(userId, auth);
		}
	})
	.catch(err => {
		console.log(err);
	})
}
// 로그인 시 시작페이지 변경
function renderPage(userId, auth) {
	const container = document.querySelector('.signup-container')
	container.innerHTML = '';
	let p = document.createElement('span');
	p.innerHTML = `환영합니다. ${userId}(${auth})님`;
	p.classList.add('welcome-user');
	container.appendChild(p);
}
init();