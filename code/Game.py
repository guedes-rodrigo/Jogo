import pygame
import sys
import os
import random
from code.Const import *
from code.Player import Player
from code.Enemy import Enemy
from code.Platform import Platform
from code.Diamond import Diamond
from code.Background import Background
from code.Menu import Menu

class Game:
    def __init__(self):
        # Inicialização do Pygame
        pygame.init()
        pygame.mixer.init()
        
        # Configuração da tela
        self.tela = pygame.display.set_mode((LARGURA, ALTURA))
        pygame.display.set_caption(TITULO_JOGO)
        self.relogio = pygame.time.Clock()
        
        # Criar menu
        self.menu = Menu(self.tela, self.relogio)
        
        # Sprites e grupos
        self.todas_sprites = pygame.sprite.Group()
        self.plataformas = pygame.sprite.Group()
        self.diamantes = pygame.sprite.Group()
        self.inimigos = pygame.sprite.Group()
        
        # Jogador
        self.jogador = None
        
        # Fundo
        self.fundo = None
        
        # Temporizadores
        self.tempo_diamante = 0
        self.tempo_inimigo = 0
        
    def inicializar_jogo(self):
        # Limpar sprites
        self.todas_sprites.empty()
        self.plataformas.empty()
        self.diamantes.empty()
        self.inimigos.empty()
        
        # Criar jogador
        self.jogador = Player()
        self.todas_sprites.add(self.jogador)
        
        # Criar plataformas
        plataforma_chao = Platform(0, ALTURA - 70, LARGURA, 70)
        self.plataformas.add(plataforma_chao)
        self.todas_sprites.add(plataforma_chao)
        
        posicoes_plataformas = [
            (100, 450, 300, 35),    # Largura 200->300, altura 20->35
            (400, 350, 250, 35),    # Largura 150->250, altura 20->35
            (650, 250, 200, 35),    # Largura 100->200, altura 20->35
            (200, 200, 200, 35),    # Largura 100->200, altura 20->35
            (450, 150, 200, 35)     # Largura não alterada, altura 20->35
        ]
        
        for pos in posicoes_plataformas:
            p = Platform(*pos)
            self.plataformas.add(p)
            self.todas_sprites.add(p)
        
        # Criar fundo
        self.fundo = Background()
        
        # Resetar temporizadores
        self.tempo_diamante = 0
        self.tempo_inimigo = 0
        
        # Música de fundo
        try:
            pygame.mixer.music.load(os.path.join(SOUND_DIR, MUSICA_FUNDO))
            pygame.mixer.music.set_volume(0.5)
            pygame.mixer.music.play(-1)  # Loop infinito
        except:
            print("Erro ao carregar a música de fundo")
    
    def loop_jogo(self):
        # Loop do jogo
        jogando = True
        while jogando:
            self.relogio.tick(FPS)
            
            # Eventos
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif evento.type == pygame.KEYDOWN:
                    if evento.key == pygame.K_SPACE:
                        self.jogador.pular()
            
            # Entrada do teclado
            teclas = pygame.key.get_pressed()
            if teclas[pygame.K_LEFT]:
                self.jogador.mover_esquerda()
            if teclas[pygame.K_RIGHT]:
                self.jogador.mover_direita()
            
            # Atualizar
            self.tempo_diamante += 1
            self.tempo_inimigo += 1
            
            # Criar diamantes periodicamente
            if self.tempo_diamante > FPS * 2:  # A cada 2 segundos
                x = LARGURA + 50
                y = random.randint(100, ALTURA - 150)  
                diamante = Diamond(x, y)
                self.diamantes.add(diamante)
                self.todas_sprites.add(diamante)
                self.tempo_diamante = 0
            
            # Criar inimigos periodicamente
            if self.tempo_inimigo > FPS * 3:  # A cada 3 segundos
                x = LARGURA + 50
                y = random.randint(100, ALTURA - 100)
                inimigo = Enemy(x, y)
                self.inimigos.add(inimigo)
                self.todas_sprites.add(inimigo)
                self.tempo_inimigo = 0
            
            # Primeiro atualizar o jogador com as plataformas
            self.jogador.update(self.plataformas)
            
            # Depois atualizar todos os outros sprites
            for sprite in self.todas_sprites:
                if sprite != self.jogador:  # Não atualizar o jogador novamente
                    sprite.update()
            
            # Verificar colisões com diamantes
            colisoes_diamantes = pygame.sprite.spritecollide(self.jogador, self.diamantes, True)
            for diamante in colisoes_diamantes:
                self.jogador.coletar_diamante()
            
            # Verificar colisões com inimigos
            colisoes_inimigos = pygame.sprite.spritecollide(self.jogador, self.inimigos, True)
            if colisoes_inimigos:
                # Parar a música de fundo
                pygame.mixer.music.stop()
                # Tocar música de fim de jogo
                try:
                    pygame.mixer.music.load(os.path.join(SOUND_DIR, MUSICA_FIM))
                    pygame.mixer.music.set_volume(0.7)
                    pygame.mixer.music.play()
                except:
                    print("Erro ao carregar a música de fim de jogo")
                jogando = False
            
            # Atualizar e desenhar fundo
            self.fundo.update()
            self.fundo.desenhar(self.tela)
            
            # Desenhar todos os sprites
            self.todas_sprites.draw(self.tela)
            
            # Desenhar pontuação
            self.menu.mostrar_texto(f"Pontuação: {self.jogador.pontuacao}", 22, LARGURA // 2, 10)
            
            # Atualizar tela
            pygame.display.flip()
        
        return self.jogador.pontuacao
    
    def run(self):
        while True:
            self.menu.mostrar_menu_principal()
            self.inicializar_jogo()
            pontuacao = self.loop_jogo()
            self.menu.mostrar_game_over(pontuacao) 