require('dotenv').config();
const app = require('./app');

const port = process.env.port || 4000;

app.listen(port, () => {
  console.log(`server is running at http://127.0.0.1:${port}`);
});
