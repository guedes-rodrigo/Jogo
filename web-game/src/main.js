// Verificar se o Phaser foi carregado corretamente
if (typeof Phaser === "undefined") {
  console.error("Erro: Phaser não foi carregado!");
  alert("Erro ao carregar o jogo. Verifique o console para mais detalhes.");
} else {
  console.log("Phaser carregado com sucesso. Versão:", Phaser.VERSION);

  // Verificar se as classes do jogo foram definidas
  if (
    typeof Menu !== "undefined" &&
    typeof GameScene !== "undefined" &&
    typeof GameOverMenu !== "undefined"
  ) {
    console.log("Classes de cena definidas");

    // Configuração do Phaser
    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      width: LARGURA,
      height: ALTURA,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: GRAVIDADE },
          debug: window.PHASER_DEBUG || false,
          debugShowBody: true,
          debugShowStaticBody: true,
          debugShowVelocity: true,
          debugVelocityColor: 0xffff00,
          debugBodyColor: 0xff00ff,
          debugStaticBodyColor: 0x0000ff,
        },
      },
      scene: [Menu, GameScene, GameOverMenu],
      pixelArt: true,
      backgroundColor: PRETO,
    };

    console.log(
      "Modo debug da física:",
      config.physics.arcade.debug ? "ATIVADO" : "DESATIVADO"
    );

    // Iniciar o jogo
    try {
      console.log("Iniciando o jogo...");
      const game = new Phaser.Game(config);
      console.log("Jogo iniciado com sucesso");
    } catch (error) {
      console.error("Erro ao iniciar o jogo:", error);
      alert("Erro ao iniciar o jogo. Verifique o console para mais detalhes.");
    }
  } else {
    console.error("Erro: Uma ou mais classes de cena não foram definidas!");
    if (typeof Menu === "undefined") console.error("Menu não definido");
    if (typeof GameScene === "undefined")
      console.error("GameScene não definido");
    if (typeof GameOverMenu === "undefined")
      console.error("GameOverMenu não definido");
    alert("Erro ao iniciar o jogo. Verifique o console para mais detalhes.");
  }
}

// Desabilitar o menu de contexto do clique direito
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
    return false;
  },
  false
);
