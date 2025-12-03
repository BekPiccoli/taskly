#!/bin/bash

# 🚀 Script para Gerar APK do Taskly
# Este script ajuda a gerar o APK com a configuração correta

echo "🎯 Gerador de APK - Taskly"
echo "================================"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta 'taskly/'"
    exit 1
fi

# Verificar se o .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "Crie um arquivo .env com: API_URL=sua-url-aqui"
    exit 1
fi

# Mostrar a URL da API configurada
echo "📡 URL da API configurada:"
cat .env | grep API_URL
echo ""

# Perguntar se está correto
read -p "A URL da API está correta? (s/n): " resposta

if [ "$resposta" != "s" ] && [ "$resposta" != "S" ]; then
    echo ""
    echo "✏️  Edite o arquivo .env e execute este script novamente"
    echo "Exemplo: API_URL=https://sua-api.onrender.com"
    exit 0
fi

echo ""
echo "🔨 Iniciando build do APK..."
echo "⏱️  Isso pode levar 10-20 minutos"
echo ""

# Executar o build
npx eas-cli build -p android --profile preview

echo ""
echo "✅ Build concluído!"
echo ""
echo "📱 Baixe o APK no link mostrado acima"
echo "📤 Envie para seu professor"
echo ""
