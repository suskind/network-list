
const async = require('async');
const ping = require('ping');
const arp = require('node-arp');
const dns = require('dns');
const request = require('request');
const ip = require('ip');


const options = {
	// ip: '192.168.1',
	timeout: 15,
	vendor: true,
    min: 1,
    max: 255
};

function getInfo(ip, callback) {
	const result = {
		ip,
		alive: false,
		hostname: null,
		mac: null,
		vendor: null,
        hostnameError: null,
        macError: null,
        vendorError: null,
	};
    // console.log(`Checking ${ip}...`);
    ping.promise.probe(ip, {
        timeout: options.timeout,
    }).then((res) => {
        if (res.alive) {
            result.alive = true;
            dns.reverse(ip, (err, host) => {
                if (err) {
                    result.hostnameError = 'Error on get hostname';
                } else {
                    result.hostname = (host && host.length) ? host[0] : null;
                }
                arp.getMAC(ip, (err2, mac) => {
                    if(err2 || !mac) {
                        result.macError = 'Error on get Mac address';
                    } else {
                        result.mac = mac.replace(/:([^:]{1}):/g, ':0$1:');
                    }
					if (options.vendor && mac) {
						request.get(`https://macvendors.co/api/${mac.replace(/:([^:]{1}):/g, ':0$1:')}/json`, (err3, httpRes, body) => {
                                // console.log(httpRes.statusCode, body);
							if(err3 || httpRes.statusCode !== 200) {
								// console.log(`Error on get vendor... ip: ${ip} : Mac: ${mac}`);
                                result.vendorError = 'Error on get vendor';
                                callback(null, result);
							} else {
                                const cont = JSON.parse(body);
                                if (cont && cont.result && cont.result.company) {
                                    result.vendor = cont.result.company;
                                    callback(null, result);
                                } else {
                                    result.vendorError = 'Vendor has no result';
                                    callback(null, result);
                                }
                            }
						});
					} else {
                        callback(null, result);
                    }
                });
            });
        } else {
            callback(null, result);
        }
    });
}

// Keep this function to use in a future version to port scan
function checkPort(port, host, callback) {
    var socket = new Socket(),
        status = null;
    socket.on('connect', () => {
        status = 'open';
        socket.end();
    });
    socket.setTimeout(1500);
    socket.on('timeout', () => {
        status = 'closed';
        socket.destroy();
    });
    socket.on('error', (exception) => {
        status = 'closed';
    });
    socket.on('close', (exception) => {
        callback(null, status,host,port);
    });
    socket.connect(port, host);
}

function getBaseIp(opts) {
    if (!('ip' in opts)) {
        const ipAddress = ip.address();
        if (ipAddress) {
            const aIp = ipAddress.split('.');
            if (aIp.length === 4) {
                opts.ip = aIp.slice(0, -1).join('.');
                return opts;
            }
        }
    } else {
        const aIp = opts.ip.split('.');
        if (aIp.length === 3) {
            return opts;
        } else {
            throw new Error('IP should be xxx.xxx.xxx');
            return;
        }
    }
    throw new Error('No IP address');
}

module.exports = {
    scanEach: function(opts, callback) {
        // console.log(opts);
        const finalOpts = getBaseIp(opts);
        Object.assign(options, finalOpts);
        // console.log(options);
        for (let i=options.min; i < options.max; i++) {
            getInfo(`${options.ip}.${i}`, callback); 
        }
    },
    scan: function(opts, callback) {
        const finalOpts = getBaseIp(opts);
        Object.assign(options, finalOpts);
        // console.log(options);
        const aIps = [];
        for (let i=options.min; i < options.max; i++) {
            aIps.push(`${options.ip}.${i}`);
        }
        async.map(aIps, getInfo, (err, results) => {
            callback(err, results);
        });
    }
}
