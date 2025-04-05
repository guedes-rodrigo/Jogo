class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, INIMIGO_IMG);

    // Adicionar à cena e habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Verificar se a textura do inimigo foi carregada
    if (!scene.textures.exists(INIMIGO_IMG)) {
      console.error(`Textura do inimigo (${INIMIGO_IMG}) não encontrada!`);
      return;
    }

    // Configurações físicas (a velocidade será definida pelo criador)
    this.body.setAllowGravity(false);

    // Armazenar posição Y inicial para manter constante
    this.posicaoY = y;
    this.cena = scene;

    // Tempo de vida (para garantir que será destruído eventualmente)
    this.tempoDeVida = 15000; // 15 segundos
    this.tempoInicio = scene.time.now;

    // Ajustar tamanho visual do sprite - REDUZIDO DE 0.7 PARA 0.5
    this.setScale(0.5);

    // Definir a profundidade do sprite para garantir que fique visível
    this.setDepth(10);

    // Ajustar a hitbox para melhorar a colisão com o jogador
    // Ajustar tamanho para corresponder melhor à pedra (mais larga)
    this.body.setSize(80, 60);

    // Ajustar o offset da hitbox para centralizar
    this.body.setOffset(160, 200); // Ajuste fino do offset para alinhar pedra

    // Configurar propriedades de colisão
    this.body.setCollideWorldBounds(false);
    this.body.setImmovable(false);

    // Verificar frames disponíveis
    const textura = scene.textures.get(INIMIGO_IMG);
    const frameTotal = textura.frameTotal;
    console.log(`Textura ${INIMIGO_IMG} carregada com ${frameTotal} frames`);

    try {
      // Animações
      if (scene.anims.get("inimigo_voar") === undefined) {
        scene.anims.create({
          key: "inimigo_voar",
          frames: [{ key: INIMIGO_IMG, frame: 0 }],
          frameRate: 5,
          repeat: -1,
        });
      }

      this.play("inimigo_voar");
    } catch (error) {
      console.error("Erro ao criar animação do inimigo:", error);
    }
  }

  update(time, delta) {
    // Verificar tempo de vida (garante que não haverá inimigos eternos)
    if (this.cena.time.now - this.tempoInicio > this.tempoDeVida) {
      console.log(
        `Destruindo inimigo por tempo de vida expirado: ${this.tempoDeVida}ms`
      );
      this.destruir();
      return;
    }

    // Destruir quando sair da tela (com margem de segurança)
    if (this.x < -100) {
      console.log(
        `Destruindo inimigo por sair da tela: x=${this.x}, y=${this.y}`
      );
      this.destruir();
      return;
    }

    // Garantir que o inimigo se mantém na mesma altura
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
    if (this.cena && this.cena.inimigosGroup) {
      this.cena.inimigosGroup.remove(this, true, true);
    }

    // Destruir o sprite
    this.destroy();
  }
}
