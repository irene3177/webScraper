const express = require('express');
const fetchController = require('./controller/fetchController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());


app.post('/scrape', fetchController.fetchUrl);
app.use(errorHandler);
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});