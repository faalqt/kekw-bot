const JSONdb = require('simple-json-db');
const db = new JSONdb('./data/messages.json');

const { Client, Intents, MessageEmbed, MessageAttachment} = require('discord.js');

const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const settings = require('./config/settings.json');
const token = settings.botToken;
const server = settings.serverID;
const board = settings.boardID;
const setEmote = settings.emote || 'kekw';
const threshhold = settings.threshhold;

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageReactionAdd', async (reaction, user) =>{
	
	emote = reaction.emoji
	count = reaction.count
	msg = reaction.message

	if (msg.guildId === server){
		// console.log("Right server");
		if(!msg.channel.nsfw && msg.channel.id != board){
			// console.log("Not NSWF and Not the message board");
			if(reaction.partial){
				try{
					await reaction.fetch();
				} catch (error) {
					console.error("Something went wrong fetching the message:", error);
					return
				}
			}

			if (!db.has(msg.id)){
				// console.log("message not already posted");
				try{
					author = msg.member.displayName;
				} catch{
					author = msg.author.username;
				}

				try{
					authorAvatar = msg.member.user.displayAvatarURL()
				} catch{
					authorAvatar = msg.author.displayAvatarURL();
				}

				var kekwedPost =  new MessageEmbed()
					.setColor('test')
					.setAuthor(author, authorAvatar)
					.setDescription(msg.content)
					.addField(`Message Link:`, `[Jump](${msg.url})`, true)
					.addField(`Channel:`, `<#${msg.channelId}>`, true)
					.setTimestamp();
					// .setFooter(count + `⭐`);

				if(msg.embeds[0]){	
					// console.log("msg has embeds");
					if(msg.embeds[0].type.includes('image')){
						kekwedPost.setImage(msg.embeds[0].url);
					} else {
						kekwedPost.addField('ahhh', 'Had trouble embeding attachment. Not a direct link?');
					}
				}

				if (msg.attachments.size >= 1) {
					// console.log("message has attachments");
					att = msg.attachments.first()
					if (att.contentType.includes('image')){
						kekwedPost.setImage(msg.attachments.first().url);
					}else if(att.contentType.includes('video')){
						kekwedPost.setDescription(`${msg.content} \n \n [${att.name}](${att.url})`);
					}
				}

				if (emote.name.toLowerCase().includes(setEmote) && count >= threshhold){
					// console.log("message has met the threshhold");
					client.channels.fetch(board).then(channel => channel.send({ embeds: [kekwedPost]}));
					db.set(msg.id, {id: `${msg.id}`, content: `${msg.content}`, timestamp: `${msg.createdAt}`});
					db.sync();
				}
				
			}
		}
	}
});

client.login(token);