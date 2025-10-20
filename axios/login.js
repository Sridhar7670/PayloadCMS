const user = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'sridharnani090@gmail.com',
    password: 'zxcvbnm,./',
  }),
}).then(async (req) => await req.json())
.then(data=>console.log("start",data,"end"))

