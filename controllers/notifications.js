var Pusher = require('pusher'),
    config = require('../config')

const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  encrypted: true
});

function hello(req, res) {
    // var pusher = new Pusher({
    //     appId: '335120',
    //     key: 'a77c6db33a10e6568489',
    //     secret: 'b13414eb5d0f8eb9e0b2',
    //     cluster: 'eu',
    //     encrypted: true
    // });

    pusher.trigger('my-channel', 'my-event', {
        "message": req.body.mssg
    });
    res.status(200).send("sent").end()
}

module.exports = {
    index: hello
}