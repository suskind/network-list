# network-list
List all network devices with an hostname and a vendor.

## Install

`npm install network-list --save`


## Methods: 

 * `scan(options, callback)` - Scan all the network devices. You'll get an array with all the results as an argument of the callback.

 * `scanEach(options, callback)` - Scan all the network devices. The callback will be executed on each iteration with an object device as argument


## How To:

```
const netList = require('network-list');

netList.scanEach({}, (err, obj) => {
    console.log(obj); // device object
});


netList.scan({}, (err, arr) => {
    console.log(arr); // array with all devices
});


```

## Options

```
{
    ip: '192.168.1' // optional base ip, by default will be the first 3 octets of IP address
    timeout: <number>, // optional ping timeout
    vendor: <boolean>, // default: true - get device vendor using MAC Address
}

```

## Result: Device Object

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




