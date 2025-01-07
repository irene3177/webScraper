import 'dotenv/config';
import express from 'express';
import fetchController from './controller/fetchController';
import errorHandler from './middleware/errorHandler';
import notFoundHandler from './middleware/notFoundHandler';
import { requestLogger, errorLogger } from './middleware/logger';

const app = express();
const { PORT = '3000' } = process.env;

app.use(express.json());

app.use(requestLogger);

//Post route for scraping
app.post('/scrape', fetchController.fetchUrl);

app.use(notFoundHandler);

app.use(errorLogger);

app.use(errorHandler);

const connect = () => {
	try {
		app.listen(PORT);
		console.log(`Server running on port ${PORT}`);
	} catch (error) {
		console.error(error);
	}
};

connect();
