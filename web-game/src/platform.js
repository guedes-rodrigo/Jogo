class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width, height) {
    super(scene, x + width / 2, y + height / 2, PLATAFORMA_IMG);

    // Adicionar à cena e habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // true indica que é estático

    // Ajustar tamanho
    this.setDisplaySize(width, height);
    this.setOrigin(0.5, 0.5);

    // Definir a profundidade para garantir que fique acima do fundo
    this.setDepth(5);

    // Ajustar corpo da colisão
    this.body.setSize(width, height);
    this.body.updateFromGameObject();
  }
}
