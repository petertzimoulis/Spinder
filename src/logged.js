logged = sessionStorage.getItem('loggedIn')
console.log(logged)
if (logged != 'true') {window.location.href = "https://www.cs.drexel.edu/~dac443/spinder/"}
