const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Sistema simples de save temporário na memória (reseta se o bot reiniciar)
const playerData = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpg')
        .setDescription('Inicia um RPG interativo.'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        
        // Inicializar jogador se não existir
        if (!playerData.has(userId)) {
            playerData.set(userId, { level: 1, hp: 100, maxHp: 100, crypto: 0, hacks: 0 });
        }
        
        const player = playerData.get(userId);

        const embed = new EmbedBuilder()
            .setTitle('PROTOCOL: ZERO - Terminal RPG')
            .setDescription(`Bem-vindo de volta a **Silver Bay**, hacker. A organização **Rust** está dominando o submundo. O que você quer fazer hoje?`)
            .setColor('#00FF00')
            .addFields(
                { name: 'Nível', value: `${player.level}`, inline: true },
                { name: 'Bateria (HP)', value: `${player.hp}/${player.maxHp}`, inline: true },
                { name: 'Crypto', value: `${player.crypto}`, inline: true }
            )
            .setFooter({ text: 'RT Studios RPG System' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('rpg_hack').setLabel('Hackear Servidor (Lutar)').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('rpg_recharge').setLabel('Recarregar Bateria (Curar)').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('rpg_upgrade').setLabel('Comprar Upgrade').setStyle(ButtonStyle.Primary)
            );

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: 'Este terminal pertence a outro hacker!', ephemeral: true });
            }

            const p = playerData.get(userId);

            if (i.customId === 'rpg_hack') {
                const damage = Math.floor(Math.random() * 20);
                const ganho = Math.floor(Math.random() * 50) + 10;
                
                p.hp -= damage;
                p.crypto += ganho;
                p.hacks += 1;

                if (p.hacks >= p.level * 3) {
                    p.level += 1;
                    p.maxHp += 20;
                    p.hp = p.maxHp;
                    p.hacks = 0;
                    await i.update({ content: `**LEVEL UP!** Você atingiu o nível ${p.level}!`, embeds: [], components: [] });
                    return;
                }

                if (p.hp <= 0) {
                    p.hp = 0;
                    playerData.delete(userId); // Morreu, reseta
                    await i.update({ content: 'Sua bateria acabou. O grupo Rust rastreou você. **GAME OVER**. Use /rpg para recomeçar.', embeds: [], components: [] });
                    return;
                }

                embed.setDescription(`Você hackeou um sistema da Rust!\nTomou **${damage}** de dano no firewall.\nGanhou **${ganho}** Crypto.`)
                     .setFields(
                        { name: 'Nível', value: `${p.level}`, inline: true },
                        { name: 'Bateria (HP)', value: `${p.hp}/${p.maxHp}`, inline: true },
                        { name: 'Crypto', value: `${p.crypto}`, inline: true }
                     );
                
                await i.update({ embeds: [embed], components: [row] });
            }

            if (i.customId === 'rpg_recharge') {
                if (p.crypto >= 20) {
                    p.crypto -= 20;
                    p.hp = p.maxHp;
                    embed.setDescription(`Você gastou 20 Crypto e recarregou toda sua bateria!`);
                } else {
                    embed.setDescription(`Você precisa de pelo menos 20 Crypto para recarregar!`);
                }
                
                embed.setFields(
                    { name: 'Nível', value: `${p.level}`, inline: true },
                    { name: 'Bateria (HP)', value: `${p.hp}/${p.maxHp}`, inline: true },
                    { name: 'Crypto', value: `${p.crypto}`, inline: true }
                );
                await i.update({ embeds: [embed], components: [row] });
            }
            
            if (i.customId === 'rpg_upgrade') {
                await i.update({ content: 'O mercado clandestino de Silver Bay ainda está sendo desenvolvido...', embeds: [], components: [] });
            }
        });
    },
};
