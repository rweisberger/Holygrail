const express = require('express');
var app       = express();
var redis     = require("redis");
var client    = redis.createClient();

// initial values
client.mset('header',0,'left',0,'article',0,'right',0,'footer',0);
client.mget(['header','left','article','right','footer'], 
  function(err, value) {
    console.log(value);
});   

function data(){
    return new Promise((resolve, reject) => {
        client.mget(['header', 'left', 'article', 'right', 'footer'],
            function(err, value) {
                const data = {
                    'header': Number(value[0]),
                    'left': Number(value[1]),
                    'article': Number(value[2]),
                    'right': Number(value[3]),
                    'footer': Number(value[4])
                };
            err ? reject(null) : resolve(data);
            }
        );
    });
}

// serve static files from public directory
app.use(express.static('public'));

// app.get('/', function(req, res) {
//     res.send('Hello World!')
// })

// get key data
app.get('/data', function (req, res) {
  data()
    .then(data => {
        console.log(data);
        res.send(data);
    });
}); 

app.get('/update/:key/:value', function (req, res) {
    const key = req.params.key;
    let value = Number(req.params.value);
    client.get(key, function(err, reply) {

        // new value
        value = Number(reply) + value;
        client.set(key, value);

        // return data to client
        data()
            .then(data => {
                console.log(data);
                res.send(data);
            });
    });
});

app.listen(3000, () => console.log('Open on port 3000'))