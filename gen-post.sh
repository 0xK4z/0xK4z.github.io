#!/bin/bash

TIMEZONE="-0300"

read -r -p "Título do post: " TITLE

echo "Selecione o tipo (isso definirá a pasta e o layout):"
select TYPE in "writeup" "article"; do
    case $TYPE in
        writeup)
            TARGET_DIR="_writeups"
            LAYOUT="writeup"
            break;;
        article)
            TARGET_DIR="_articles"
            LAYOUT="article"
            break;;
        *) echo "Opção inválida. Escolha 1 ou 2.";;
    esac
done

mkdir -p "$TARGET_DIR"

SLUG=$(echo "$TITLE" | iconv -t ascii//TRANSLIT | tr '[:upper:]' '[:lower:]' | tr -s ' ' '-' | tr -dc '[:alnum:]-')
DATE_FILE=$(date +%Y-%m-%d)
DATE_FULL=$(date +"%Y-%m-%d %H:%M:%S")
FILENAME="${DATE_FILE}-${SLUG}.md"
FILEPATH="${TARGET_DIR}/${FILENAME}"

# 3. Gerar o Template
cat <<EOF > "$FILEPATH"
---
layout: ${LAYOUT}
title: "${TITLE}"
date: ${DATE_FULL} ${TIMEZONE}
summary: ""
complexity: "Low"
tags: []
---

# ${TITLE}

> [!TIP]
> Escreva o resumo acima e adicione as tags necessárias.

EOF

echo -e "\n\033[0;32m[+]\033[0m Template criado em: $FILEPATH"