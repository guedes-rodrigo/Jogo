class Background {
  constructor(scene) {
    this.scene = scene;
    this.fundos = [];

    // Verificar se a imagem de fundo existe
    if (!scene.textures.exists(FUNDO_IMG)) {
      console.error(`Imagem de fundo ${FUNDO_IMG} não encontrada!`);
      return;
    }

    // Criar dois fundos para efeito parallax
    try {
      console.log("Criando sprites de fundo");
      for (let i = 0; i < 2; i++) {
        let bg = scene.add.tileSprite(0, 0, LARGURA, ALTURA, FUNDO_IMG);
        bg.setOrigin(0, 0);
        bg.setScrollFactor(0);
        bg.setPosition(i * LARGURA, 0);
        // Definir profundidade mais baixa para o fundo
        bg.setDepth(1);

        this.fundos.push(bg);
      }
      console.log(`Fundos criados: ${this.fundos.length}`);
    } catch (error) {
      console.error("Erro ao criar fundos:", error);
    }
  }

  update() {
    // Mover os fundos para efeito parallax
    if (this.fundos && this.fundos.length > 0) {
      for (let i = 0; i < this.fundos.length; i++) {
        this.fundos[i].tilePositionX += 1;
      }
    }
  }
}
