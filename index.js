const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('The GrocHouse is running')
})

app.listen(port, () => {
    console.log("Site is running", port)
})