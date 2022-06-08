import express from 'express'
import session from 'express-session';
import cors from 'cors';
import AppRoutes from './src/AppRoutes/index.js';
const port = 5000

const app = express();



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 360000000000, secure: false, httpOnly: false }
}))


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))


app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  next()
})

app.use(cors(
  {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    preflightContinue: true
  }
));

app.use((req, res, next) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    if (err) next();
    else {
      if (req.session.user) {
        res.locals.auth = true
      } else {
        res.locals.auth = false
      }
      next()
    }
  })
})


app.get('/', (req, res) => {
  if (res.locals.auth)
    res.status(200).json({ msg: "Hello World" });
  else {
    res.status(200).json({ msg: 'No Hello' });
  }
})

new AppRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})