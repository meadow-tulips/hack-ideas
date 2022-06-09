import express from 'express'
import session from 'express-session';
import cors from 'cors';
import AppRoutes from './src/AppRoutes/index.js';
import tranformMiddleware from './src/transform-middleware.js';
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



app.get('/', (req, res, next) => {
  if (req.session?.user)
    res.locals.data = { code: 200, response: "Hello World"};
  else {
    res.locals.data = { code: 200, response: "No Hello"};
  }
  next();
}, tranformMiddleware)

new AppRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})