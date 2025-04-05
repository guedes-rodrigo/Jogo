class Menu extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    // Carregar recursos necessários para o menu
    this.load.audio(MUSICA_FUNDO, `${SOUND_DIR}/musica_fundo.mp3`);

    // Verificar se estamos precarregando os assets da GameScene aqui
    console.log("Menu preload iniciado");
  }

  create() {
    console.log("Menu create iniciado");

    // Título do jogo
    this.add
      .text(LARGURA / 2, ALTURA / 4, TITULO_JOGO, {
        fontFamily: "Arial",
        fontSize: "48px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Instruções
    this.add
      .text(
        LARGURA / 2,
        ALTURA / 2,
        "Use as setas para mover e espaço para pular",
        {
          fontFamily: "Arial",
          fontSize: "24px",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    // Botão iniciar
    const botaoIniciar = this.add
      .text(LARGURA / 2, (ALTURA * 3) / 4, "INICIAR JOGO", {
        fontFamily: "Arial",
        fontSize: "32px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
        padding: {
          x: 20,
          y: 10,
        },
      })
      .setOrigin(0.5);

    botaoIniciar.setInteractive();

    botaoIniciar.on("pointerover", () => {
      botaoIniciar.setStyle({ fill: "#ff0" });
    });

    botaoIniciar.on("pointerout", () => {
      botaoIniciar.setStyle({ fill: "#fff" });
    });

    botaoIniciar.on("pointerdown", () => {
      console.log("Botão de iniciar clicado");

      // Garantir que o carregamento da próxima cena está funcionando corretamente
      try {
        console.log("Iniciando transição para GameScene");
        this.scene.start("GameScene");
        console.log("Transição para GameScene iniciada com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar GameScene:", error);
        alert(
          "Erro ao iniciar o jogo. Verifique o console para mais detalhes."
        );
      }
    });

    console.log("Menu create concluído");
  }
}

class GameOverMenu extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.pontuacao = data.pontuacao || 0;
  }

  create() {
    // Título Game Over
    this.add
      .text(LARGURA / 2, ALTURA / 4, "GAME OVER", {
        fontFamily: "Arial",
        fontSize: "48px",
        fill: "#ff0000",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Pontuação
    this.add
      .text(LARGURA / 2, ALTURA / 2, `Pontuação: ${this.pontuacao}`, {
        fontFamily: "Arial",
        fontSize: "32px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Botão tentar novamente
    const botaoJogarNovamente = this.add
      .text(LARGURA / 2, (ALTURA * 3) / 4, "JOGAR NOVAMENTE", {
        fontFamily: "Arial",
        fontSize: "32px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
        padding: {
          x: 20,
          y: 10,
        },
      })
      .setOrigin(0.5);

    botaoJogarNovamente.setInteractive();

    botaoJogarNovamente.on("pointerover", () => {
      botaoJogarNovamente.setStyle({ fill: "#ff0" });
    });

    botaoJogarNovamente.on("pointerout", () => {
      botaoJogarNovamente.setStyle({ fill: "#fff" });
    });

    botaoJogarNovamente.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
