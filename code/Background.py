import pygame
import os
from code.Const import *

class Background:
    def __init__(self):
        self.imagem = self.carregar_imagem(FUNDO_IMG, (LARGURA, ALTURA))
        self.x1 = 0
        self.x2 = LARGURA
        self.velocidade = 1

    def update(self):
        self.x1 -= self.velocidade
        self.x2 -= self.velocidade
        
        if self.x1 <= -LARGURA:
            self.x1 = LARGURA
            
        if self.x2 <= -LARGURA:
            self.x2 = LARGURA

    def desenhar(self, superficie):
        superficie.blit(self.imagem, (self.x1, 0))
        superficie.blit(self.imagem, (self.x2, 0))
        
    def carregar_imagem(self, nome, tamanho=None):
        try:
            caminho = os.path.join(IMAGE_DIR, nome)
            imagem = pygame.image.load(caminho).convert_alpha()
            if tamanho:
                imagem = pygame.transform.scale(imagem, tamanho)
            return imagem
        except pygame.error:
            # Se não conseguir carregar a imagem, cria uma superfície colorida
            cor = (100, 150, 255)  # Azul claro para fundo
            surf = pygame.Surface(tamanho)
            surf.fill(cor)
            return surf 