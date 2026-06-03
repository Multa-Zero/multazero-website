#!/usr/bin/env bash
# Deploy do site + blog para S3/CloudFront.
#
# Pré-requisitos:
#   - AWS CLI configurado (aws configure) com permissão no bucket e na distribuição
#   - Variáveis de ambiente:
#       export S3_BUCKET=nome-do-bucket
#       export CF_DISTRIBUTION_ID=E123ABC...
#   Uso:  ./scripts/deploy-s3.sh
set -euo pipefail

: "${S3_BUCKET:?defina S3_BUCKET (ex.: export S3_BUCKET=meu-bucket)}"
: "${CF_DISTRIBUTION_ID:?defina CF_DISTRIBUTION_ID (ex.: export CF_DISTRIBUTION_ID=E123ABC)}"

echo "==> Build combinado (site + blog em dist/)"
npm run build

echo "==> Sincronizando dist/ -> s3://$S3_BUCKET"
# --delete remove do bucket o que não está mais em dist/.
# Use apenas se o bucket guarda SÓ este site. Se compartilha com outros arquivos, remova --delete.
aws s3 sync dist/ "s3://$S3_BUCKET" --delete

echo "==> Invalidando cache do CloudFront ($CF_DISTRIBUTION_ID)"
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"

echo "✓ Deploy concluído. Confira https://multazero.co/ e https://multazero.co/blog"
