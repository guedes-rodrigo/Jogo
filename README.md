# Myliss e os Patos

Um jogo de plataforma 2D desenvolvido em Python usando a biblioteca Pygame.

## Estrutura do Projeto

```
JogoPython/
│
├── main.py                 # Ponto de entrada do jogo
├── build.py                # Script para preparar o ambiente
├── create_exe.py           # Script para criar o executável Windows
├── requirements.txt        # Dependências do projeto
│
├── code/                   # Código-fonte do jogo
│   ├── __init__.py         # Torna a pasta code um pacote Python
│   ├── Const.py            # Constantes do jogo
│   ├── Game.py             # Classe principal do jogo
│   ├── Player.py           # Classe do jogador
│   ├── Enemy.py            # Classe dos inimigos
│   ├── Platform.py         # Classe das plataformas
│   ├── Diamond.py          # Classe das diamantes
│   ├── Background.py       # Classe do plano de fundo
│   └── Menu.py             # Classe do menu
│
└── asset/                  # Recursos do jogo
    ├── images/             # Imagens e sprites
    └── sounds/             # Efeitos sonoros e músicas
```

## Requisitos

- Python 3.8+
- Pygame 2.5.2+
- PyInstaller 6.3.0+ (para criar executável)

## Instalação

1. Execute o script de build para preparar o ambiente:

```bash
python build.py
```

2. Inicie o jogo:

```bash
python main.py
```

## Criando um Executável para Windows

Para criar um arquivo .exe que pode ser executado em qualquer computador Windows (sem precisar do Python instalado):

1. Execute diretamente o comando:

```bash
python -m PyInstaller --name=myllisseosPatos --onefile --windowed --add-data="asset;asset" main.py
```

OU

2. Use o script simplificado:

```bash
python create_exe.py
```

3. Após a conclusão, o executável será encontrado na pasta `dist`.

O arquivo myllisseosPatos.exe pode ser distribuído e executado em qualquer computador Windows sem precisar do Python instalado.

## Controles

- **Setas para esquerda/direita**: Movimentar o jogador
- **Espaço**: Pular
- **Qualquer tecla**: Navegar pelos menus

## Objetivo

Sobreviva o máximo de tempo possível, coletando diamantes e evitando inimigos. Cada diamante coletada vale 10 pontos.
