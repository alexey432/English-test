const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

// database.insert({what:'hi', _id:123})

app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        // console.log(data);
        res.json(data)
    })
    
})

app.post('/api', (req, res) => {
    const ddd = req.body;
    
    database.update({_id:ddd._id}, {$set:{a:ddd.a, b:ddd.b, c:ddd.c}}, {} );
    if (ddd.new == 123) {
        // console.log('yes')
        database.remove({}, { multi: true }, function (err, numRemoved) {
        });
    } else {
        database.insert(ddd);
        // console.log('no')
    }
    res.json(ddd);
});

