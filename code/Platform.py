import pygame
import os
from code.Const import *

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, largura, altura):
        super().__init__()
        self.image = self.carregar_imagem(PLATAFORMA_IMG, (largura, altura))
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        
    def carregar_imagem(self, nome, tamanho=None):
        try:
            caminho = os.path.join(IMAGE_DIR, nome)
            imagem = pygame.image.load(caminho).convert_alpha()
            if tamanho:
                imagem = pygame.transform.scale(imagem, tamanho)
            return imagem
        except pygame.error:
            # Se não conseguir carregar a imagem, cria uma superfície colorida
            cor = (150, 75, 0)  # Marrom para plataformas
            surf = pygame.Surface(tamanho)
            surf.fill(cor)
            return surf 