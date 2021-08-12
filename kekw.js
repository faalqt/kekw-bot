const JSONdb = require('simple-json-db');
const db = new JSONdb('./data/messages.json');

const { Client, Intents, MessageEmbed} = require('discord.js');

const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const settings = require('./config/settings.json');
const token = settings.botToken;
const server = settings.serverID;
const board = settings.boardID;
const threshhold = settings.threshhold;


client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageReactionAdd', async (reaction, user) =>{
	
	emote = reaction.emoji
	count = reaction.count
	msg = reaction.message

	if (msg.guildId === server){

		if(reaction.partial){
			try{
				await reaction.fetch();
			} catch (error) {
				console.error("Something went wrong fetching the message:", error);
				return
			}
		}


		if (!db.has(msg.id)){
			try{
				author = msg.member.displayName;
			} catch{
				author = msg.author.username;
			}

			try{
				authorAvatar = msg.member.user.displayAvatarURL()
				// console.log("Member");
			} catch{
				authorAvatar = msg.author.displayAvatarURL();
				// console.log("Author");
			}

			// console.log(authorAvatar);

			var kekwedPost =  new MessageEmbed()
				.setColor('test')
				.setAuthor(author, authorAvatar)
				.setDescription(msg.content)
				.addField(`Message Link:`, `[Jump](${msg.url})`, true)
				.addField(`Channel:`, `<#${msg.channelId}>`, true)
				.setTimestamp();
				// .setFooter(count + `⭐`);

			if (msg.attachments.size >= 1) {
				att = msg.attachments.first()
				if (att.contentType === 'image/jpeg') {
					kekwedPost.setImage(msg.attachments.first().url);
				}else if(att.contentType === 'video/mp4'){
					kekwedPost.setDescription(`${msg.content} \n \n [${att.name}](${att.url})`);
				}
			}

			if (emote.name.toLowerCase().includes("kekw") && count >= threshhold){
				// console.log("Met the threshhold");
				client.channels.fetch(board).then(channel => channel.send({ embeds: [kekwedPost] }));
				db.set(msg.id, {id: `${msg.id}`, content: `${msg.content}`, timestamp: `${msg.createdAt}`});
				db.sync();
			}
			
		}
	}
});

client.login(token);