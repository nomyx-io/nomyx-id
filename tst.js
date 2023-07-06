// wss://ws-direct.exchange.coinbase.com
// Request
// Subscribe to ETH-USD and ETH-EUR with the level2, heartbeat and ticker channels,
// plus receive the ticker entries for ETH-BTC and ETH-USD
// {
//     "type": "subscribe",
//     "product_ids": [
//         "ETH-USD",
//         "ETH-EUR"
//     ],
//     "channels": [
//         "level2",
//         "heartbeat",
//         {
//             "name": "ticker",
//             "product_ids": [
//                 "ETH-BTC",
//                 "ETH-USD"
//             ]
//         }
//     ]
// }
// To begin receiving feed messages, you must send a subscribe message to the server indicating which channels and products to receive. This message is mandatory—you are disconnected if no subscribe has been received within 5 seconds.

// connect to the websocket and subscribe to the desired channels and output to console
const websocket = new WebSocket('wss://ws-feed.pro.coinbase.com');

function sendSubscription() {
    websocket.send(
        JSON.stringify({
            type: 'subscribe',
            product_ids: ['ETH-BTC', 'ETH-USD'],
            channels: ['ticker'],
        })
    );
}

websocket.onopen = function (event) {
    sendSubscription();
}

websocket.onmessage = function (event) {
    console.log(event.data);
}

// keep the connection alive by responding to the server's ping messages
websocket.onmessage = function (event) {
    const response = JSON.parse(event.data);
    if (response.type === 'ping') {
        websocket.send(JSON.stringify({
            type: 'pong',
        }));
    }
}

debugger