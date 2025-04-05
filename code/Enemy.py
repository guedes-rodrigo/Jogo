import pygame
import random
import os
from code.Const import *

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = self.carregar_imagem(INIMIGO_IMG, (70, 70))
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.velocidade = random.randint(2, 5)

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
            cor = (139, 69, 19)  # Marrom para ursos (cor alterada)
            surf = pygame.Surface((70, 70))
            surf.fill(cor)
            return surf 