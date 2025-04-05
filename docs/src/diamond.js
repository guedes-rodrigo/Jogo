class Diamond extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, DIAMANTE_IMG);

    // Adicionar à cena e habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Verificar se a textura do diamante foi carregada
    if (!scene.textures.exists(DIAMANTE_IMG)) {
      console.error(`Textura do diamante (${DIAMANTE_IMG}) não encontrada!`);
      return;
    }

    // Configurações físicas (a velocidade será definida pelo criador)
    this.body.setAllowGravity(false);

    // Armazenar posição Y inicial para manter constante
    this.posicaoY = y;
    this.cena = scene; // Referência à cena para poder remover do grupo

    // Tempo de vida (para garantir que será destruído eventualmente)
    this.tempoDeVida = 15000; // 15 segundos
    this.tempoInicio = scene.time.now;

    // Ajustar tamanho
    this.setScale(0.75);

    // Garantir que o diamante fique visível à frente
    this.setDepth(10);

    // Ajustar a hitbox para melhorar a colisão - AUMENTADA PARA FACILITAR COLETA
    const tamanhoPadrao = 50; // Aumentado de 30 para 50 para facilitar a coleta
    this.body.setSize(tamanhoPadrao, tamanhoPadrao);

    // Ajustar offset para centralizar a hitbox
    this.body.setOffset(15, 15); // Ajustado para centralizar hitbox 50x50 na imagem

    // Verificar frames disponíveis
    const textura = scene.textures.get(DIAMANTE_IMG);
    const frameTotal = textura.frameTotal;
    console.log(`Textura ${DIAMANTE_IMG} carregada com ${frameTotal} frames`);

    try {
      // Animações
      if (scene.anims.get("diamante_girar") === undefined) {
        scene.anims.create({
          key: "diamante_girar",
          frames: [{ key: DIAMANTE_IMG, frame: 0 }],
          frameRate: 10,
          repeat: -1,
        });
      }

      this.play("diamante_girar");
    } catch (error) {
      console.error("Erro ao criar animação do diamante:", error);
    }
  }

  update(time, delta) {
    // Verificar tempo de vida (garante que não haverá diamantes eternos)
    if (this.cena.time.now - this.tempoInicio > this.tempoDeVida) {
      console.log(
        `Destruindo diamante por tempo de vida expirado: ${this.tempoDeVida}ms`
      );
      this.destruir();
      return;
    }

    // Destruir quando sair da tela (com margem de segurança)
    if (this.x < -100) {
      console.log(
        `Destruindo diamante por sair da tela: x=${this.x}, y=${this.y}`
      );
      this.destruir();
      return;
    }

    // Garantir que o diamante se mantém na mesma altura
    if (this.y !== this.posicaoY) {
      this.y = this.posicaoY;
      this.setVelocityY(0);
    }
  }

  // Método centralizado para destruição
  destruir() {
    // Verificar se o objeto já foi destruído
    if (!this.active || !this.body) {
      return;
    }

    // Remover do grupo de física para garantir limpeza completa
    if (this.cena && this.cena.diamantesGroup) {
      this.cena.diamantesGroup.remove(this, true, true);
    }

    // Destruir o sprite
    this.destroy();
  }
}
