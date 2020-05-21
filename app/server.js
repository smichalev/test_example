require('dotenv').config();

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const NATS = require('nats');

const nc = NATS.connect({
	"servers": [
		process.env.NATS_SERVER,
	],
});

server.listen(process.env.PORT, () => {
	console.log('Сервер запущен! Перейдите на http://' + process.env.HOST + ':' + process.env.PORT);
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	nc.subscribe('from_db', (data) => {
		let newVal = JSON.parse(data);
		
		let total = {
			sum: [],
			max: [],
			min: [],
			avg: [],
		};
		
		for (let i = 0; i < newVal.length; i++) {
			let a = 0;
			let b = [];
			
			for (let k = 1; k <= 20; k++) {
				a += +newVal[i]['value' + k];
				b.push(+newVal[i]['value' + k]);
			}
			
			total.sum.push(a.toFixed(4));
			total.max.push(Math.max.apply(null, b).toFixed(4));
			total.min.push(Math.min.apply(null, b).toFixed(4));
			total.avg.push((total.sum[i] / 20).toFixed(4));
		}
		
		socket.emit('notify', {data: newVal, total});
	});
});
