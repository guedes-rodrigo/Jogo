import pygame
from code.Const import *
import os

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.imagem_original = self.carregar_imagem(JOGADOR_IMG, (100, 100))
        self.image = self.imagem_original
        self.rect = self.image.get_rect()
        self.rect.center = (LARGURA // 4, ALTURA // 2)
        self.velocidade_y = 0
        self.no_chao = False
        self.pontuacao = 0
        # Usar som vazio no lugar de carregar arquivos de som
        self.som_pulo = pygame.mixer.Sound(buffer=b'')
        self.som_diamante = pygame.mixer.Sound(buffer=b'')
        # Adicionando uma referência às plataformas
        self.plataformas_atuais = None
        # Velocidade horizontal fixa 
        self.velocidade_x = 8  # Aumentada para movimento mais rápido

    def update(self, plataformas=None):
        # Se plataformas não for fornecido, usar a referência armazenada
        if plataformas is not None:
            self.plataformas_atuais = plataformas
        
        # Se ainda não temos plataformas, não podemos atualizar colisões
        if self.plataformas_atuais is None:
            return
            
        # Gravidade
        self.velocidade_y += GRAVIDADE
        self.rect.y += self.velocidade_y
        
        # Resetar status de chão no início da verificação
        self.no_chao = False
        
        # Verificar colisão com o chão (primeiro piso)
        if self.rect.bottom >= ALTURA - 70:  # Atualizado para plataforma do chão mais alta (70px)
            self.rect.bottom = ALTURA - 70
            self.velocidade_y = 0
            self.no_chao = True
        
        # Verificar colisão com plataformas - Margem de colisão aumentada para plataformas maiores
        for plataforma in self.plataformas_atuais:
            # Aumentar a margem de colisão vertical para 40 pixels (era 30)
            if (self.rect.bottom >= plataforma.rect.top and 
                self.rect.bottom <= plataforma.rect.top + 40 and
                self.rect.right >= plataforma.rect.left + 15 and  # Margem horizontal ajustada (era 10)
                self.rect.left <= plataforma.rect.right - 15 and  # Margem horizontal ajustada (era 10)
                self.velocidade_y > 0):
                
                self.rect.bottom = plataforma.rect.top
                self.velocidade_y = 0
                self.no_chao = True
        
        # Manter o jogador dentro da tela
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > LARGURA:
            self.rect.right = LARGURA
        if self.rect.top < 0:
            self.rect.top = 0
            
    def pular(self):
        if self.no_chao:
            self.velocidade_y = FORCA_PULO
            # Não tocar o som, apenas pular
            # self.som_pulo.play()

    def coletar_diamante(self):
        self.pontuacao += 10
        # Não tocar o som, apenas incrementar pontuação
        # self.som_diamante.play()
        
    def mover_esquerda(self):
        self.rect.x -= self.velocidade_x
        
    def mover_direita(self):
        self.rect.x += self.velocidade_x
        
    def carregar_imagem(self, nome, tamanho=None):
        try:
            caminho = os.path.join(IMAGE_DIR, nome)
            imagem = pygame.image.load(caminho).convert_alpha()
            if tamanho:
                imagem = pygame.transform.scale(imagem, tamanho)
            return imagem
        except pygame.error:
            # Se não conseguir carregar a imagem, cria uma superfície colorida
            cor = (255, 0, 0)  # Vermelho para erro
            surf = pygame.Surface((80, 80))
            surf.fill(cor)
            return surf
            
    def carregar_som(self, nome):
        # Retornar sempre um som vazio, sem tentar carregar arquivo
        return pygame.mixer.Sound(buffer=b'') 