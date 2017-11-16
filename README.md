# network-list
List all network devices with hostname and vendor 

## Install

`npm install network-list --save`


## Methods: 

 * `scan(options, callback)` - scan all network devices and an array will all results is passed to callback
 * `scanEach(options, callback)` - scan all network devices and callback is called for each device passing the device object


## How To:

```
const netList = require('network-list');

netList.scanEach({}, (err, obj) => {
    console.log(obj); // object device
});


netList.scan({} (err, arr) => {
    console.log(arr); // array with all devices
});


```

## Options

```
{
    ip: '192.168.1' // optional base ip, by default will be the first 3rd octets of IP address
    timeout: <number>, // optional ping timeout
    vendor: <boolean>, // default: true - get device vendor using MAC Address
}

```

## Result 

```
{
        ip: '192.168.1.1', // IP address
        alive: false, // true/false - device is alive
        hostname: null, // string - dns reverse hostname
        mac: null, // string - MAC address
        vendor: null, // string - vendor name
        hostnameError: null, // Error message if got error on getting hostname
        macError: null, // Error message if got an error on getting Mac Address
        vendorError: null, // Error message if got an error on getting vendor name
}
```




