const Discord = require("discord.js");
const botSettings = require("./botsettings.json"); 
const messages = require("./messages.json");

const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true}); // Disables the bot tagging @everyone

bot.on("ready", async () => {
    console.log(`${bot.user.username} Is Ready!`);
    bot.user.setActivity(botSettings.activity, { type: 'WATCHING'});
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
    } catch(e) {
        console.log(e.stack)
    }
});

//When new member joins the Discord server
bot.on('guildMemberAdd', member => {
    member.send(messages.welcome); //Sends new member a welcome DM
    member.addRole(role).catch(console.error) //Adds new member to member role

    //Announce Member Milestones
    let totalUsers = new Discord.RichEmbed()
    .setAuthor("Andrei Neagoie", "https://cdn-images-1.medium.com/max/1200/1*B3FAQic_0zR_cmLdMyAVXw.jpeg")
    .setColor("#ff6600")
    .setTitle("WOW, we just reached " + `${bot.users.size}` + " Members")
    .setDescription("Thanks message!.")
    .setThumbnail("https://openclipart.org/image/2400px/svg_to_png/94135/new-year01.png")

    if(bot.users.size === 1) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 2) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 3) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 4) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 5) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 6) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 7) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 8000) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 9000) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
    if(bot.users.size === 1000) bot.channels.get(`${botSettings.milestoneChannelID}`).sendMessage(totalUsers);
 });

//Bot detects message
bot.on("message", async message => {
    if(message.author.bot) return; //Ensures wont listen to other bot messages (inluding its own)
    



    // If message was a DM
    if(message.channel.type === "dm") {
        if (message.content.toLowerCase().includes('rules'))                message.channel.send(messages.rules);
        else if (message.content.toLowerCase().includes('help'))            message.channel.send(messages.dmHelp);
        else if (message.content.toLowerCase().includes('1'))               message.channel.send(messages.codeBlocks);
        else if (message.content.toLowerCase().includes('2'))               message.channel.send(messages.markdown);
        else if (message.content.toLowerCase().includes('3'))               message.channel.send(messages.tagging);     
      }

    // If message was in a public channel
    let messageArray = message.content.split(" ");
    let command = messageArray[0]; 
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return; // Igonores messages without the prefix

    if(command === `${prefix}welcome`)          message.channel.send(messages.welcome);
    if(command === `${prefix}help`)             message.channel.send(messages.channelHelp);
    if(command === `${prefix}links`)            message.channel.send(messages.links); 
    if(command === `${prefix}markdown`)         message.channel.send(messages.markdown);
    if(command === `${prefix}codeblocks`)       message.channel.send(messages.codeBlocks);


    // Purge Message Command - 
    if(command === `${prefix}purge`) {
        if(message.member.roles.some(r=>["leadership team", "management team"].includes(r.name)) ) {
            const user = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            message.channel.fetchMessages({
            limit: amount,
            }).then((messages) => {
            if (user) {
            const filterBy = user ? user.id : Client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            }
            message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            });
          } else {
            message.reply('Only The Management Team can execute this command!');
          }
    };

});

bot.login(botSettings.token);