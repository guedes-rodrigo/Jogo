import os
import sys
import subprocess
import shutil

print("===== CRIAÇÃO DE EXECUTÁVEL PARA Myliss e os Patos =====")
print("Iniciando criação do executável... isso pode demorar alguns minutos.")

# Criar spec file personalizado
spec_content = """
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('asset', 'asset')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='jogo',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
"""

# Salvar o spec file
with open("diamantes.spec", "w") as f:
    f.write(spec_content)

# Executar o PyInstaller com o spec file
comando = 'python -m PyInstaller diamantes.spec'

# Executar o comando
print(f"Executando: {comando}")
os.system(comando)

print("\nExecutável criado na pasta 'dist'.")
print("\nCopiando assets manualmente para garantir que estejam no lugar certo...")

# Verificar se a pasta dist existe
if os.path.exists("dist"):
    # Criar pasta de assets no diretório dist
    os.makedirs("dist/asset/images", exist_ok=True)
    os.makedirs("dist/asset/sounds", exist_ok=True)
    
    # Copiar assets para a pasta dist
    if os.path.exists("asset"):
        for root, dirs, files in os.walk("asset"):
            for file in files:
                src_path = os.path.join(root, file)
                # Caminho relativo para preservar a estrutura
                rel_path = os.path.relpath(src_path, ".")
                dst_path = os.path.join("dist", rel_path)
                # Criar diretório de destino se não existir
                os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                # Copiar o arquivo
                shutil.copy2(src_path, dst_path)
                print(f"Copiado: {rel_path} para {dst_path}")

print("\nExecutável pronto para uso!")
print("Você pode distribuir a pasta 'dist' inteira ou apenas o arquivo .exe com a pasta 'asset'.") 