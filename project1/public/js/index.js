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
	const container = document.querySelector('.signup-container')
	container.innerHTML = '';
	let p = document.createElement('span');
	p.innerHTML = `환영합니다. ${userId}님`
	container.appendChild(p);
}

init();