class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, JOGADOR_IMG);

    // Adicionar à cena e habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Verificar se a textura do jogador foi carregada
    if (!scene.textures.exists(JOGADOR_IMG)) {
      console.error(`Textura do jogador (${JOGADOR_IMG}) não encontrada!`);
      return;
    }

    // Configurações físicas
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);

    // Ajustar tamanho e hitbox para melhorar a detecção de colisão
    this.setScale(0.5);

    // Garantir que o jogador fique visível acima de outros elementos
    this.setDepth(20);

    // Ajustar a hitbox do jogador para melhorar a coleta de diamantes e detecção de inimigos
    this.body.setSize(80, 90); // Aumentada a largura de 60 para 80
    this.body.setOffset(20, 30); // Ajustado offset para melhor alinhamento visual

    // Exibir informações da hitbox para debug
    console.log(
      `Jogador hitbox: (${this.body.x}, ${this.body.y}, ${this.body.width}, ${this.body.height})`
    );

    // Propriedades do jogador
    this.pontuacao = 0;
    this.velocidadeMovimento = 300;
    this.noChao = false;
    this.animando = true;
    this.ativo = true; // Jogador começa ativo

    // Sons
    this.somPulo = scene.sound.add(PULO_SOM);
    this.somDiamante = scene.sound.add(DIAMANTE_SOM);

    // Verificar frames disponíveis
    const textura = scene.textures.get(JOGADOR_IMG);
    const frameTotal = textura.frameTotal;
    console.log(`Textura ${JOGADOR_IMG} carregada com ${frameTotal} frames`);

    // Criar animações somente com os frames disponíveis
    try {
      if (scene.anims.get("jogador_correr") === undefined) {
        // Usar apenas um único frame para cada animação até corrigir a sprite
        scene.anims.create({
          key: "jogador_correr",
          frames: [{ key: JOGADOR_IMG, frame: 0 }],
          frameRate: 10,
          repeat: -1,
        });

        scene.anims.create({
          key: "jogador_idle",
          frames: [{ key: JOGADOR_IMG, frame: 0 }],
          frameRate: 10,
          repeat: -1,
        });

        scene.anims.create({
          key: "jogador_pular",
          frames: [{ key: JOGADOR_IMG, frame: 0 }],
          frameRate: 10,
          repeat: -1,
        });

        scene.anims.create({
          key: "jogador_morrer",
          frames: [{ key: JOGADOR_IMG, frame: 0 }],
          frameRate: 10,
          repeat: 0,
        });

        console.log("Animações do jogador criadas com sucesso");
      }
    } catch (error) {
      console.error("Erro ao criar animações:", error);
      this.animando = false;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.animando || !this.ativo) return;

    try {
      // Verificar se está tocando o chão
      this.noChao = this.body.touching.down || this.body.blocked.down;

      // Animar conforme o estado (com tratamento de erro)
      if (!this.noChao) {
        this.play("jogador_pular", true);
      } else if (this.body.velocity.x !== 0) {
        this.play("jogador_correr", true);
      } else {
        this.play("jogador_idle", true);
      }

      // Virar sprite conforme a direção
      if (this.body.velocity.x < 0) {
        this.setFlipX(true);
      } else if (this.body.velocity.x > 0) {
        this.setFlipX(false);
      }
    } catch (error) {
      console.error("Erro na animação:", error);
      this.animando = false;
    }
  }

  moverEsquerda() {
    if (!this.ativo) return;
    this.setVelocityX(-this.velocidadeMovimento);
  }

  moverDireita() {
    if (!this.ativo) return;
    this.setVelocityX(this.velocidadeMovimento);
  }

  parar() {
    if (!this.ativo) return;
    this.setVelocityX(0);
  }

  pular() {
    if (!this.ativo) return;
    if (this.noChao) {
      this.setVelocityY(FORCA_PULO);
      this.somPulo.play();
    }
  }

  coletarDiamante() {
    if (!this.ativo) return;
    this.pontuacao += 10;
    this.somDiamante.play();
  }

  // Método para desativar o jogador após colisão com inimigo
  desativar() {
    console.log("Desativando jogador após colisão com inimigo");
    this.ativo = false;

    // Mostrar animação de morte
    try {
      this.play("jogador_morrer");
    } catch (error) {
      console.error("Erro ao executar animação de morte:", error);
    }

    // Congelar o jogador
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
  }
}
