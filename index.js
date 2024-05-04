const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const {fromEvent, take} = require("rxjs");

const log4js = require("log4js");
log4js.configure("./config/log-config.json");
const logger = log4js.getLogger("system");
const webApiLogger = log4js.getLogger("webapi");

try{
	logger.info("Application Start");

	// リクエストボディを受け付けられるようにする
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.use((req, res, next) => {
		// WebAPIにアクセスされた時にログを記録する
		webApiLogger.debug(req.url);
		next();
	});

	// APIルーティング
	app.use("/api", require("./api"));

	// .env呼び出し
	require("dotenv").config();

	// ポート番号
	const PORT_NUMBER = process.env.PORT_NUMBER;

	// サーバー起動
	const server = app.listen(PORT_NUMBER, () => {
		logger.info(`Server Start: ${PORT_NUMBER}`);

		// Ctrl+Cが押されたらサーバーを閉じて終了する
		fromEvent(process, "SIGINT")
			.pipe(take(1))
			.subscribe(e => {
				server.close();
				logger.info("Server Closed");
				process.exit(0);
			});
	});
}catch(e){
	logger.fatal(e);
}