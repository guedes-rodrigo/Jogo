class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Mapeamento dos recursos a serem carregados para melhor depuração
    const resources = [
      // Imagens (usando como imagens simples em vez de spritesheets)
      { type: "image", key: JOGADOR_IMG, path: `${IMAGE_DIR}/jogador.png` },
      { type: "image", key: INIMIGO_IMG, path: `${IMAGE_DIR}/inimigo.png` },
      { type: "image", key: DIAMANTE_IMG, path: `${IMAGE_DIR}/diamante.png` },
      {
        type: "image",
        key: PLATAFORMA_IMG,
        path: `${IMAGE_DIR}/plataforma.png`,
      },
      { type: "image", key: FUNDO_IMG, path: `${IMAGE_DIR}/fundo.jpg` },

      // Sons
      { type: "audio", key: PULO_SOM, path: `${SOUND_DIR}/pulo.mp3` },
      { type: "audio", key: DIAMANTE_SOM, path: `${SOUND_DIR}/diamante.mp3` },
      {
        type: "audio",
        key: MUSICA_FUNDO,
        path: `${SOUND_DIR}/musica_fundo.mp3`,
      },
      { type: "audio", key: MUSICA_FIM, path: `${SOUND_DIR}/fim_jogo.mp3` },
    ];

    // Carregar cada recurso e registrar sucesso/erro
    resources.forEach((resource) => {
      console.log(`Tentando carregar: ${resource.key} (${resource.path})`);

      switch (resource.type) {
        case "spritesheet":
          this.load.spritesheet(resource.key, resource.path, resource.options);
          break;
        case "image":
          this.load.image(resource.key, resource.path);
          break;
        case "audio":
          this.load.audio(resource.key, resource.path);
          break;
      }
    });

    // Adicionar log para depuração
    console.log("Preload concluído");

    // Adicionar tratamento de erro para imagens
    this.load.on("filecomplete", function (key) {
      console.log("Arquivo carregado com sucesso:", key);
    });

    this.load.on("loaderror", function (file) {
      console.error("Erro ao carregar arquivo:", file.key, file.src);

      // Verificar se o arquivo existe utilizando fetch
      fetch(file.src)
        .then((response) => {
          if (!response.ok) {
            console.error(
              `Arquivo não encontrado (${response.status}): ${file.src}`
            );
          } else {
            console.log(
              `Arquivo existe mas não pode ser carregado: ${file.src}`
            );
          }
        })
        .catch((error) => {
          console.error(`Erro ao verificar arquivo: ${file.src}`, error);
        });
    });
  }

  create() {
    console.log("Iniciando create()");
    // Configurar física do mundo
    this.physics.world.setBounds(0, 0, LARGURA, ALTURA);
    this.physics.world.gravity.y = GRAVIDADE;

    // Criar fundo com profundidade baixa
    try {
      console.log("Criando fundo");
      this.fundo = new Background(this);
      console.log("Fundo criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar fundo:", error);
    }

    // Grupos de sprites com profundidades definidas
    this.plataformasGroup = this.physics.add.staticGroup();
    // Configurar profundidade das plataformas
    this.plataformasGroup.setDepth(5);

    this.diamantesGroup = this.physics.add.group();
    // Coletáveis ficam em uma camada acima
    this.diamantesGroup.setDepth(10);

    this.inimigosGroup = this.physics.add.group({
      allowGravity: false,
      immovable: false,
    });
    // Inimigos também em uma camada acima
    this.inimigosGroup.setDepth(10);

    // Criar plataformas
    try {
      console.log("Criando plataformas");
      this.criarPlataformas();
      console.log("Plataformas criadas com sucesso");
    } catch (error) {
      console.error("Erro ao criar plataformas:", error);
    }

    // Criar jogador
    try {
      console.log("Criando jogador");
      this.jogador = new Player(this, 100, ALTURA - 200);
      // Jogador deve ficar na frente de tudo
      this.jogador.setDepth(20);
      console.log("Jogador criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar jogador:", error);
    }

    // Configurar colisões
    this.physics.add.collider(this.jogador, this.plataformasGroup);

    // Colisão com diamantes (overlap - não físico)
    this.physics.add.overlap(
      this.jogador,
      this.diamantesGroup,
      this.coletarDiamante,
      null,
      this
    );

    // Colisão com inimigos (overlap - não físico)
    this.colisaoInimigos = this.physics.add.overlap(
      this.jogador,
      this.inimigosGroup,
      this.atingirInimigo,
      null,
      this
    );

    console.log("Colisões configuradas");

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Temporizadores
    this.tempoDiamante = 0;
    this.tempoInimigo = 0;

    // Pontuação - UI fica na camada mais alta
    this.textoPontuacao = this.add
      .text(LARGURA / 2, 20, "Pontuação: 0", {
        fontFamily: "Arial",
        fontSize: "24px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100); // UI sempre no topo

    // Música de fundo
    try {
      console.log("Iniciando música de fundo");
      this.musicaFundo = this.sound.add(MUSICA_FUNDO, {
        loop: true,
        volume: 0.5,
      });
      this.musicaFundo.play();
      console.log("Música iniciada com sucesso");
    } catch (error) {
      console.error("Erro ao iniciar música:", error);
    }

    // Variável para controlar se o jogo acabou
    this.gameOver = false;

    // Adicionar modo debug para visualizar hitboxes
    if (this.physics.config.debug) {
      console.log("Modo debug de física ativado");
    }

    console.log("Create() concluído");
  }

  update(time, delta) {
    // Não atualizar se o jogo acabou
    if (this.gameOver) return;

    // Entrada do jogador
    if (this.cursors.left.isDown) {
      this.jogador.moverEsquerda();
    } else if (this.cursors.right.isDown) {
      this.jogador.moverDireita();
    } else {
      this.jogador.parar();
    }

    if (this.cursors.space.isDown || this.cursors.up.isDown) {
      this.jogador.pular();
    }

    // Atualizar fundo
    this.fundo.update();

    // Gerar diamantes e inimigos
    this.tempoDiamante += delta;
    this.tempoInimigo += delta;

    // Verificar quantidade atual de diamantes antes de criar mais
    const diamantesAtivos = this.diamantesGroup.countActive();
    if (this.tempoDiamante > 2000 && diamantesAtivos < 5) {
      // limitar a 5 diamantes ativos
      this.criarDiamante();
      this.tempoDiamante = 0;
    }

    // Verificar quantidade atual de inimigos antes de criar mais
    const inimigosAtivos = this.inimigosGroup.countActive();
    if (this.tempoInimigo > 3000 && inimigosAtivos < 3) {
      // limitar a 3 inimigos ativos
      this.criarInimigo();
      this.tempoInimigo = 0;
    }

    // Limpar e atualizar grupos periodicamente
    if (time % 5000 < 20) {
      // a cada ~5 segundos
      this.limparObjetosForaDaTela();
    }

    // Atualizar objetos com verificação de existência
    if (this.diamantesGroup && this.diamantesGroup.getChildren) {
      this.diamantesGroup.getChildren().forEach((diamante) => {
        if (diamante && diamante.update && diamante.active) {
          diamante.update(time, delta);
        } else if (diamante && !diamante.active) {
          // Remover objetos inativos
          this.diamantesGroup.remove(diamante, true, true);
        }
      });
    }

    if (this.inimigosGroup && this.inimigosGroup.getChildren) {
      this.inimigosGroup.getChildren().forEach((inimigo) => {
        if (inimigo && inimigo.update && inimigo.active) {
          inimigo.update(time, delta);
        } else if (inimigo && !inimigo.active) {
          // Remover objetos inativos
          this.inimigosGroup.remove(inimigo, true, true);
        }
      });
    }

    // Atualizar texto de pontuação
    this.textoPontuacao.setText(`Pontuação: ${this.jogador.pontuacao}`);
  }

  // Função para limpar objetos fora da tela
  limparObjetosForaDaTela() {
    // Limpar diamantes fora da área visível
    this.diamantesGroup.getChildren().forEach((diamante) => {
      if (diamante.x < -100 || diamante.y < -100 || diamante.y > ALTURA + 100) {
        console.log(
          `Removendo diamante em posição invivável: x=${diamante.x}, y=${diamante.y}`
        );
        diamante.destroy();
        this.diamantesGroup.remove(diamante, true, true);
      }
    });

    // Limpar inimigos fora da área visível
    this.inimigosGroup.getChildren().forEach((inimigo) => {
      if (inimigo.x < -100 || inimigo.y < -100 || inimigo.y > ALTURA + 100) {
        console.log(
          `Removendo inimigo em posição invivável: x=${inimigo.x}, y=${inimigo.y}`
        );
        inimigo.destroy();
        this.inimigosGroup.remove(inimigo, true, true);
      }
    });

    console.log(
      `Após limpeza: ${this.diamantesGroup.countActive()} diamantes, ${this.inimigosGroup.countActive()} inimigos`
    );
  }

  criarPlataformas() {
    // Plataforma do chão
    let plataformaChao = new Platform(this, 0, ALTURA - 70, LARGURA, 70);
    this.plataformasGroup.add(plataformaChao);

    // Plataformas suspensas
    const posicoesPlataformas = [
      { x: 100, y: 450, largura: 300, altura: 35 },
      { x: 400, y: 350, largura: 250, altura: 35 },
      { x: 650, y: 250, largura: 200, altura: 35 },
      { x: 200, y: 200, largura: 200, altura: 35 },
      { x: 450, y: 150, largura: 200, altura: 35 },
    ];

    posicoesPlataformas.forEach((plat) => {
      let plataforma = new Platform(
        this,
        plat.x,
        plat.y,
        plat.largura,
        plat.altura
      );
      this.plataformasGroup.add(plataforma);
    });
  }

  criarDiamante() {
    const x = LARGURA + 50;
    // Dividir a área de spawn em zonas para evitar empilhamento
    const zonas = 4; // Dividir em 4 zonas verticais
    const zonaAltura = (ALTURA - 250) / zonas;
    const zonaIndex = Phaser.Math.Between(0, zonas - 1);
    const zonaY = 100 + zonaIndex * zonaAltura;
    const y = Phaser.Math.Between(zonaY, zonaY + zonaAltura);

    console.log(`Criando diamante em x:${x}, y:${y} (zona ${zonaIndex + 1})`);

    try {
      // Verificar se já existe algum objeto nesta área
      let areaLivre = true;
      this.diamantesGroup.getChildren().forEach((d) => {
        if (Math.abs(d.y - y) < 50 && d.x > LARGURA - 100) {
          areaLivre = false;
        }
      });

      // Não criar se a área já está ocupada
      if (!areaLivre) {
        console.log("Área já ocupada, cancelando criação do diamante");
        return;
      }

      const diamante = new Diamond(this, x, y);
      this.diamantesGroup.add(diamante);

      // Velocidade aleatória (para espalhar os objetos horizontalmente)
      const velocidadeX = Phaser.Math.Between(-220, -180);
      diamante.setVelocityX(velocidadeX);
      diamante.setVelocityY(0);
      diamante.body.velocity.y = 0;

      console.log(
        `Diamante criado - velocidade: X=${diamante.body.velocity.x}, Y=${diamante.body.velocity.y}`
      );
      console.log(
        `Total de diamantes ativos: ${this.diamantesGroup.countActive()}`
      );
    } catch (error) {
      console.error("Erro ao criar diamante:", error);
    }
  }

  criarInimigo() {
    const x = LARGURA + 50;
    // Dividir a área de spawn em zonas para evitar empilhamento
    const zonas = 3; // Dividir em 3 zonas verticais
    const zonaAltura = (ALTURA - 200) / zonas;
    const zonaIndex = Phaser.Math.Between(0, zonas - 1);
    const zonaY = 100 + zonaIndex * zonaAltura;
    const y = Phaser.Math.Between(zonaY, zonaY + zonaAltura);

    console.log(`Criando inimigo em x:${x}, y:${y} (zona ${zonaIndex + 1})`);

    try {
      // Verificar se já existe algum objeto nesta área
      let areaLivre = true;
      this.inimigosGroup.getChildren().forEach((i) => {
        if (Math.abs(i.y - y) < 70 && i.x > LARGURA - 100) {
          areaLivre = false;
        }
      });

      // Verificar também se há diamantes por perto
      this.diamantesGroup.getChildren().forEach((d) => {
        if (Math.abs(d.y - y) < 70 && d.x > LARGURA - 100) {
          areaLivre = false;
        }
      });

      // Não criar se a área já está ocupada
      if (!areaLivre) {
        console.log("Área já ocupada, cancelando criação do inimigo");
        return;
      }

      const inimigo = new Enemy(this, x, y);
      this.inimigosGroup.add(inimigo);

      // Velocidade aleatória (para espalhar os objetos horizontalmente)
      const velocidadeX = Phaser.Math.Between(-170, -130);
      inimigo.setVelocityX(velocidadeX);
      inimigo.setVelocityY(0);
      inimigo.body.velocity.y = 0;

      console.log(
        `Inimigo criado - velocidade: X=${inimigo.body.velocity.x}, Y=${inimigo.body.velocity.y}`
      );
      console.log(
        `Total de inimigos ativos: ${this.inimigosGroup.countActive()}`
      );
    } catch (error) {
      console.error("Erro ao criar inimigo:", error);
    }
  }

  coletarDiamante(jogador, diamante) {
    console.log(`Coletando diamante em x=${diamante.x}, y=${diamante.y}`);

    try {
      // Usar o método destruir do diamante
      if (diamante && diamante.destruir) {
        diamante.destruir();
      } else {
        // Fallback para o caso do método destruir não existir
        if (this.diamantesGroup) {
          this.diamantesGroup.remove(diamante, true, true);
        }
        diamante.destroy();
      }

      // Atualizar pontuação
      jogador.coletarDiamante();

      console.log(
        `Diamante coletado. Total restante: ${this.diamantesGroup.countActive()}`
      );
    } catch (error) {
      console.error("Erro ao coletar diamante:", error);
    }
  }

  atingirInimigo(jogador, inimigo) {
    // Verificar se o jogo já acabou ou se algum dos objetos não está ativo
    if (this.gameOver || !jogador.active || !inimigo.active) return;

    console.log(
      `COLISÃO CONFIRMADA entre jogador e inimigo em x=${inimigo.x}, y=${inimigo.y}`
    );

    // Marcar o jogo como terminado
    this.gameOver = true;

    // Desabilitar todas as novas colisões
    if (this.colisaoInimigos) {
      this.colisaoInimigos.active = false;
    }

    try {
      // Parar música de fundo
      if (this.musicaFundo && this.musicaFundo.isPlaying) {
        this.musicaFundo.stop();
      }

      // Tocar som de fim de jogo
      this.sound.play(MUSICA_FIM);

      // Desabilitar controles do jogador
      jogador.desativar();

      // Mostrar efeito visual da colisão (opcional)
      this.cameras.main.shake(500, 0.03);

      // Pausar movimento dos inimigos
      this.inimigosGroup.getChildren().forEach((i) => {
        if (i && i.body) {
          i.body.velocity.x = 0;
          i.body.velocity.y = 0;
        }
      });

      // Pausar o jogo brevemente antes de mostrar a tela de game over
      this.time.delayedCall(1500, () => {
        // Remover todos os objetos da cena
        this.limparTodosObjetos();

        // Mostrar tela de game over
        this.scene.start("GameOverScene", {
          pontuacao: this.jogador.pontuacao,
        });
      });
    } catch (error) {
      console.error("Erro ao processar colisão com inimigo:", error);
      // Garantir que o jogo termina mesmo com erro
      this.scene.start("GameOverScene", { pontuacao: this.jogador.pontuacao });
    }
  }

  // Função para limpar todos os objetos da cena
  limparTodosObjetos() {
    try {
      // Limpar diamantes
      this.diamantesGroup.clear(true, true);

      // Limpar inimigos
      this.inimigosGroup.clear(true, true);
    } catch (error) {
      console.error("Erro ao limpar objetos:", error);
    }
  }
}
