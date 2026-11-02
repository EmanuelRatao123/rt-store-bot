const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um jogador do servidor.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('O usuário a ser banido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') ?? 'Nenhum motivo especificado.';
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.bannable) {
            return interaction.reply({ content: 'Eu não tenho permissão para banir este usuário!', ephemeral: true });
        }

        await member.ban({ reason });
        await interaction.reply(`O usuário **${user.tag}** foi banido pelo martelo da justiça. Motivo: ${reason}`);
    },
};
