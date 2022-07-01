require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const routes = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use(routes);

sequelize
	.sync({
		// force: true,
	})
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
