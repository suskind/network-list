
const mynmap = require('./src/index.js');


// mynmap.scanEach({}, (err, obj) => {
//    console.log('Each IP :: ', obj);
// });

// mynmap.scanEach({ip: '192.168.1'}, (err, obj) => {
//    console.log('Each IP :: ', obj);
// });

mynmap.scan({}, (err, arr) => {
    console.log('All IPs :: ', arr);
});

// mynmap.scan({ip: '192.168.1'}, (err, arr) => {
//    console.log('All IPs :: ', arr);
// });

