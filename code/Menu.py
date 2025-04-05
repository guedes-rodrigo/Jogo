import pygame
import sys
from code.Const import *

class Menu:
    def __init__(self, tela, relogio):
        self.tela = tela
        self.relogio = relogio
        
    def mostrar_texto(self, texto, tamanho, x, y, cor=BRANCO):
        fonte = pygame.font.Font(None, tamanho)
        superficie_texto = fonte.render(texto, True, cor)
        retangulo_texto = superficie_texto.get_rect()
        retangulo_texto.midtop = (x, y)
        self.tela.blit(superficie_texto, retangulo_texto)
        
    def mostrar_menu_principal(self):
        self.tela.fill(PRETO)
        self.mostrar_texto(TITULO_JOGO, 64, LARGURA // 2, ALTURA // 4)
        self.mostrar_texto("Setas para mover, Espaço para pular", 22, LARGURA // 2, ALTURA // 2)
        self.mostrar_texto("Pressione qualquer tecla para começar", 18, LARGURA // 2, ALTURA * 3/4)
        pygame.display.flip()
        
        esperando = True
        while esperando:
            self.relogio.tick(FPS)
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif evento.type == pygame.KEYUP:
                    esperando = False
                    
    def mostrar_game_over(self, pontuacao):
        self.tela.fill(PRETO)
        self.mostrar_texto("GAME OVER", 64, LARGURA // 2, ALTURA // 4)
        self.mostrar_texto(f"Pontuação: {pontuacao}", 36, LARGURA // 2, ALTURA // 2)
        self.mostrar_texto("Pressione qualquer tecla para jogar novamente", 18, LARGURA // 2, ALTURA * 3/4)
        pygame.display.flip()
        
        esperando = True
        while esperando:
            self.relogio.tick(FPS)
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif evento.type == pygame.KEYUP:
                    esperando = False 