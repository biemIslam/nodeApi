import { createServer } from 'http';
import app from './app';


const server = createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server running on port ${port}`)
});