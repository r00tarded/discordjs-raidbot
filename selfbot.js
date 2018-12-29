const Discord = require('discord.js');
const client = new Discord.Client();

/*
~ Edit these to your liking. ~
*/
//Command prefix...
const prefix = "/";
//Your token...
const token = "replace this text here with token";
//DM someone when they join the group...
const joinDM = false;
//The group you want to "join dm" in... (Group ID please)
const joinGroup = "";
//The "join dm" message you want to send...
const joinMessage = "Hello!";
/*
~ End of values you can edit. ~
*/

/*
List of commands:
purge <amount of msgs>,
(purge/delete your messages)

spam <milliseconds> <milisec between each msg> <message>
(custom spam a channel/DM)

channels <milliseconds> <milisec between each msg> <group id> <message>
(spam all channels in a group at once)

dm <group id> <message>
(spam all members in a group via DM)

gid
(get list of group ids & names)

dms <message>
(dm every member in mevery group)
*/


/*
Ready handler.
*/
client.on('ready', () => {
    try {
        console.log("Node.js version: " + process.version + "\nDiscord.js version: " + Discord.version);
    } catch (error) {
        console.log("[Ready] " + error);
    }
});

/*
Error handler.
*/
client.on('error', () => {
    try {
        console.log("ERROR: " + error);
    } catch (err) {
        console.log("[Error] " + err);
    }
});

/*
Message handler.
*/
client.on('message', message => {
    try {
        if (message.author == client.user.id) {
            var channel = message.channel;
            var args = message.content.split(" ");
            //purge
            if (args[0] == prefix + 'prune') {
                if (args[1] != null) {
                    let isMsgManager = message.member.hasPermission("MANAGE_MESSAGES");
                    if (isMsgManager) {
                        let messagecount = args[1];
                        if (messagecount >= 100) {
                            console.log("Message deletion limit. (Keep deletion below 100 per purge)");
                        }
                        channel.fetchMessages({ limit: messagecount })
                            .then(messages => channel.bulkDelete(messages));
                    } else {
                        console.log("No manage messages permission here.");
                    }
                } else {
                    console.log("Invalid purge syntax. (" + prefix + "purge <amount of messages>)");
                }
                message.delete();
            }
            //custom spam
            if (args[0] == prefix + 'spam') {
                if (args[1] != null && args[2] != null && args[3] != null) {
                    delete args[0];
                    var time = args[1];
                    delete args[1];
                    var between = args[2];
                    delete args[2];
                    var msg = args.join(" ");
                    var interval = setInterval(function () {
                        --time;
                        if (time != 1) {
                            channel.send(msg);
                        } else {
                            clearInterval();
                        }
                    }, between);
                } else {
                    console.log("Invalid spam syntax. (" + prefix + "spam <milliseconds> <milisec between each msg> <message>)");
                }
                message.delete();
            }
            //all channel spam
            if (args[0] == prefix + 'channels') {
                if (args[1] != null && args[2] != null && args[3] != null && args[4] != null) {
                    delete args[0];
                    var time = args[1];
                    delete args[1];
                    var between = args[2];
                    delete args[2];
                    var gid = args[3];
                    delete args[3];
                    var msg = args.join(" ");
                    var interval = setInterval(function () {
                        --time;
                        if (time != 1) {
                            client.guilds.get(gid).channels.map(c => {
                                if (c.type == "text") channel.send(msg);
                            });
                        } else {
                            clearInterval();
                        }
                    }, between);
                } else {
                    console.log("Invalid channels syntax. (" + prefix + "channels <milliseconds> <milisec between each msg> <group id> <message>)");
                }
                message.delete();
            }
            //all member spam
            if (args[0] == prefix + 'dm') {
                if (args[1] != null && args[2] != null) {
                    delete args[0];
                    var gid = args[1];
                    delete args[1];
                    var msg = args.join(" ");
                    client.guilds.get(gid).members.map(m => {
                        m.send(msg);
                    });
                } else {
                    console.log("Invalid dm syntax. (" + prefix + "dm <group id> <message>)");
                }
                message.delete();
            }
            //get all group ids
            if (args[0] == prefix + 'gid') {
                client.guilds.map(g => {
                    console.log("Group name: " + g.name + "\nGroup ID: " + g.id);
                });
            }
            //dm every member in every group...
            if (args[0] == prefix + 'dms') {
                if (args[1] != null) {
                    delete args[0];
                    var msg = args.join(" ");
                    client.guilds.map(g => {
                        client.guilds.get(g.id).members.map(m => {
                            m.send(msg);
                        });
                    });
                } else {
                    console.log("Invalid dms syntax. (" + prefix + "dms <message>)");
                }
            }
        }
    } catch (err) {
        console.log("[Message] " + err);
    }
});

/*
Join handler
*/
client.on('guildMemberAdd', (member, channel, guild) => {
    try {
        if (joinDM != false && joinGroup != null && joinGroup != "" && joinMessage != "") {
            if (typeof (member) != "undefined") {
                var gid = member.guild.id;
                if (gid == joinGroup) {
                    member.send(joinMessage);
                }
            }
        }
    } catch (err) {
        console.log("[Join] " + err);
    }
});

client.login(token);
