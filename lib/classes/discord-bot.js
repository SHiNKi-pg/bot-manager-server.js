const {Client, GatewayIntentBits} = require("discord.js");

module.exports = class DiscordBot {
	/**
	 * ログインします。
	 * @param {String} token トークン文字列
	 */
	constructor(token){
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		})
		this.client.login(token);
	}

	/**
	 * このDiscordBotを破棄します。
	 */
	destroy(){
		this.client.destroy();
	}
}
