import express from 'express'
import AppRoutes from './src/AppRoutes/index.js';
const port = 5000

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

new AppRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})