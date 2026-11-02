const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Cria uma mensagem embed personalizada e bonita.')
        .addStringOption(option => option.setName('titulo').setDescription('Título do embed').setRequired(true))
        .addStringOption(option => option.setName('descricao').setDescription('Descrição do embed').setRequired(true))
        .addStringOption(option => option.setName('cor').setDescription('Cor em HEX (ex: #FF0000)').setRequired(false)),
    
    async execute(interaction) {
        const title = interaction.options.getString('titulo');
        const description = interaction.options.getString('descricao');
        const color = interaction.options.getString('cor') || '#2B2D31'; // Cor padrão do Discord

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: 'CRIADO POR EMANUEL RATÃO', iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
