const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

app.listen(5000, () => console.log(`Server running on port ${5000}`));