require('dotenv').config();

const Sequelize = require('sequelize');
const NATS = require('nats');
const nc = NATS.connect({
	"servers": [
		process.env.NATS_SERVER,
	],
});

const sequilize = new Sequelize({
	database: process.env.DB__DATABASE,
	username: process.env.DB__USERNAME,
	password: process.env.DB__PASSWORD,
	host: process.env.DB__HOST,
	port: process.env.DB__PORT,
	dialect: process.env.DB__DIALECT,
});

let obj = {};

obj.id = {
	type: sequilize.Sequelize.STRING,
	allowNull: false,
	primaryKey: true,
	unique: true,
};

for (let i = 1; i <= 20; i++) {
	obj['value' + i] = {
		type: sequilize.Sequelize.STRING,
		allowNull: false,
		unique: false,
	};
}

const Model = sequilize.define('values', obj, {
	timestamps: false,
});

(async () => {
	try {
		await Model.sync({force: true});
		
		for (let i = 1; i <= 20; i++) {
			let obj = {
				id: 'Entity' + i,
			};
			
			for (let i = 1; i <= 20; i++) {
				obj['value' + i] = '0';
			}
			
			await Model.create(obj);
			
			nc.subscribe('from_generator', async (data) => {
				let newValue = JSON.parse(data);
				
				for (let i = 0; i < newValue.length; i++) {
					let element = await Model.findOne({
						where: {
							id: newValue[i].id,
						},
					});
					
					if (element) {
						for (let p = 1; p <= 20; p++) {
							element['value' + p] = newValue[i]['value' + p];
						}
						
						await element.save();
						
						nc.publish('from_db', JSON.stringify(newValue));
					}
				}
			});
		}
	}
	catch (e) {
		console.error(e);
	}
})();


