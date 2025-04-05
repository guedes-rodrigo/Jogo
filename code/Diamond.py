import pygame
import random
import os
from code.Const import *

class Diamond(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = self.carregar_imagem(DIAMANTE_IMG, (80, 80))
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.velocidade = random.randint(1, 3)

    def update(self):
        self.rect.x -= self.velocidade
        if self.rect.right < 0:
            self.kill()
            
    def carregar_imagem(self, nome, tamanho=None):
        try:
            caminho = os.path.join(IMAGE_DIR, nome)
            imagem = pygame.image.load(caminho).convert_alpha()
            if tamanho:
                imagem = pygame.transform.scale(imagem, tamanho)
            return imagem
        except pygame.error:
            # Se não conseguir carregar a imagem, cria uma superfície colorida
            cor = (255, 215, 0)  # Dourado para diamantes
            surf = pygame.Surface((40, 40))
            surf.fill(cor)
            return surf 