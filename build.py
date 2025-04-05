import os
import shutil
import sys
import subprocess
import time

def verificar_requisitos():
    """Verifica se as dependências estão instaladas."""
    try:
        # Instalar pygame
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame==2.5.2"])
        print("Pygame instalado com sucesso!")
        return True
    except subprocess.CalledProcessError:
        print("Erro ao instalar os requisitos.")
        return False

def instalar_pyinstaller():
    """Instala o PyInstaller manualmente, evitando conflitos."""
    try:
        # Tenta desinstalar versão anterior
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "uninstall", "-y", "pyinstaller"])
            time.sleep(2)  # Aguarda para garantir que os arquivos sejam liberados
        except:
            pass  # Ignora erros se não estiver instalado
            
        # Instala PyInstaller
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pyinstaller"])
        print("PyInstaller instalado com sucesso!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erro ao instalar PyInstaller: {e}")
        return False

def criar_estrutura_diretorios():
    """Cria a estrutura de diretórios do jogo."""
    diretorios = [
        "code",
        "asset/images",
        "asset/sounds"
    ]
    
    for diretorio in diretorios:
        os.makedirs(diretorio, exist_ok=True)
    
    print("Estrutura de diretórios criada!")

def criar_executavel():
    """Cria um executável Windows usando PyInstaller."""
    try:
        # Instalação do PyInstaller
        if not instalar_pyinstaller():
            print("Não foi possível instalar o PyInstaller. O executável não será criado.")
            return False
            
        # Opções de compilação
        add_data_param = "asset;asset" if sys.platform == "win32" else "asset:asset"
        icon_param = ""
        
        if os.path.exists("asset/images/diamond.png"):
            icon_param = "--icon=asset/images/diamond.png"
        
        # Criar o executável com todos os assets incluídos
        cmd = [
            "pyinstaller",
            "--name=jogo",
            "--onefile",
            "--windowed",
            f"--add-data={add_data_param}",
        ]
        
        if icon_param:
            cmd.append(icon_param)
            
        cmd.append("main.py")
        
        # Usando caminho direto para o pyinstaller em vez da versão instalada
        subprocess.check_call(cmd)
        
        print("Executável criado com sucesso na pasta 'dist'!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erro ao criar o executável: {e}")
        return False
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return False

def main():
    """Função principal de build."""
    print("Iniciando processo de build do jogo...")
    
    # Verificar requisitos
    if not verificar_requisitos():
        return
    
    # Criar estrutura de diretórios
    criar_estrutura_diretorios()
    
    # Perguntar se deseja criar um executável
    criar_exe = input("Deseja criar um executável para Windows? (s/n): ").lower() == 's'
    if criar_exe:
        print("Iniciando criação do executável... isso pode demorar alguns minutos.")
        if criar_executavel():
            print("Build e compilação concluídos com sucesso!")
            print("O executável está na pasta 'dist'.")
        else:
            print("\nAlternativa manual:")
            print("1. Abra um novo prompt de comando como administrador")
            print("2. Execute: pip install pyinstaller")
            print("3. Execute: pyinstaller --onefile --windowed --add-data=asset;asset main.py")
    else:
        print("Build concluído com sucesso!")
        print("Execute 'python main.py' para iniciar o jogo.")

if __name__ == "__main__":
    main() 