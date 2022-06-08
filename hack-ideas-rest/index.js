import express from 'express'
import session from 'express-session';
import cors from 'cors';
import AppRoutes from './src/AppRoutes/index.js';
const port = 5000

const app = express();




app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

app.use(cors(
  {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
  }
));

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000,secure: false, httpOnly: false }
}))


app.get('/', (req, res) => {
  console.log(req)
  req.sessionStore.get(req.headers.token, (err, session) => {
    console.log(session)
  })
  if(req.session.user)
    res.status(200).json({ msg: "Hello World" });
  else 
    res.status(200).json({msg: 'No Hello'});
})  

new AppRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})