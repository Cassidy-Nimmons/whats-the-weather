import dotenv from 'dotenv';
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();



// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3001;
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
