const NATS = require('nats');
const nc = NATS.connect({
	"servers": [
		process.env.NATS_SERVER,
	],
});

console.log('Генератор новых значений запущен!');

let generate = () => {
	let newValue = [];
	
	for (let i = 0; i <= 20; i++) {
		let element = {};
		element.id = 'Entity' + i;
		
		for (let n = 1; n <= 20; n++) {
			element['value' + n] = (Math.random() * (1 - -1) + -1).toFixed(4);
		}
		
		newValue.push(element);
	}
	
	return newValue;
};


let push = () => {
	nc.publish('from_generator', JSON.stringify(generate()));
};

push();

setInterval(push, 100);
