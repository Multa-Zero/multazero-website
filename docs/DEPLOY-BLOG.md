# Deploy automático do blog — Sanity → GitHub Actions → S3/CloudFront

Guia para o **dev** configurar a publicação automática: ao **publicar um post no Sanity Studio**, o site é rebuildado e enviado para o S3/CloudFront em ~1–2 min, sem ação manual.

> Arquitetura: site estático (SSG). O conteúdo vem da Sanity **no build**. Por isso, publicar = disparar um rebuild. Quem faz o "disparo" é o **webhook**.

---

## Visão geral do fluxo

```
Publicar no Studio (Sanity)
   │  webhook (só em documentos PUBLICADOS, não rascunhos)
   ▼
GitHub API  →  repository_dispatch (event_type: "sanity-publish")
   │
   ▼
GitHub Actions  (.github/workflows/deploy.yml)
   │  npm run build      → dist/ (site na raiz + dist/blog/)
   │  aws s3 sync dist/  → bucket S3
   │  cloudfront create-invalidation (/*)
   ▼
https://multazero.co/blog  atualizado
```

O mesmo workflow também roda a cada **push na `main`** (mudança de código).

## Pré-requisitos
- Workflow já versionado: `.github/workflows/deploy.yml` (não precisa criar).
- Acessos: **AWS** (criar IAM user), **GitHub** (admin do repo `Multa-Zero/multazero-website`), **Sanity** (manage do projeto `57jbjtzh`).

---

## Passo 1 — Secrets da AWS no GitHub
Sem isso o workflow roda mas **pula** o deploy (por design).

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `AWS_ACCESS_KEY_ID` | access key do IAM user |
| `AWS_SECRET_ACCESS_KEY` | secret do IAM user |
| `AWS_REGION` | região do bucket (ex.: `us-east-1`) |
| `S3_BUCKET` | nome do bucket |
| `CF_DISTRIBUTION_ID` | ID da distribuição CloudFront |

Política mínima do IAM user (troque `SEU_BUCKET`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "S3List",   "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::SEU_BUCKET" },
    { "Sid": "S3Write",  "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::SEU_BUCKET/*" },
    { "Sid": "CFInvalidate", "Effect": "Allow", "Action": ["cloudfront:CreateInvalidation"], "Resource": "*" }
  ]
}
```

---

## Passo 2 — Token do GitHub (o webhook usa para autenticar)
O webhook da Sanity chama a API do GitHub e precisa de um token.

GitHub → **Settings (da conta) → Developer settings → Personal access tokens**:
- **Classic** (mais simples): gere um token com o scope **`repo`**.
- **ou Fine-grained**: *Repository access* = `multazero-website`; *Permissions* → **Contents: Read and write**.

Copie o token (`ghp_…`). Trate como senha — você usa no Passo 3.

---

## Passo 3 — Webhook na Sanity
sanity.io/manage → projeto **MultaZero Blog** → **API → Webhooks → Create webhook**:

| Campo | Valor |
|---|---|
| **Name** | `Rebuild site (GitHub Actions)` |
| **Dataset** | `production` |
| **URL** | `https://api.github.com/repos/Multa-Zero/multazero-website/dispatches` |
| **HTTP method** | `POST` |
| **HTTP Headers** | `Authorization: Bearer SEU_TOKEN`  •  `Accept: application/vnd.github+json` |
| **Trigger on** | ✅ Create  ✅ Update  ✅ Delete |
| **Filter** | `_type in ["post","author","category"] && !(_id in path("drafts.**"))` |
| **Projection** | `{"event_type": "sanity-publish"}` |
| **API version** | deixe a padrão (mais recente) |

⚠️ **Dois pontos que mais quebram:**
- A **Projection** é obrigatória e tem que ser **exatamente** `{"event_type": "sanity-publish"}`. Sem ela, a Sanity envia o documento inteiro e o GitHub responde **422**.
- O **Filter** com `!(_id in path("drafts.**"))` faz disparar **só no Publish** — sem ele, cada autosave de rascunho viraria um deploy.

> O filtro inclui `author` e `category` porque editar um autor/categoria também muda o que aparece nos posts. Se quiser disparar só por post, use `_type == "post" && !(_id in path("drafts.**"))`.

---

## Passo 4 — Testar
1. No Studio, **publique** (ou edite e republique) um post.
2. sanity.io/manage → o webhook → aba **Attempts/Log**: deve mostrar **HTTP 204** do GitHub (sucesso).
3. GitHub → aba **Actions**: deve aparecer um run disparado por **`repository_dispatch`**.
4. Em ~1–2 min, o post aparece em `https://multazero.co/blog`.

---

## Troubleshooting

| Sintoma | Causa provável / correção |
|---|---|
| Webhook log = **401/403** | Token inválido ou sem permissão (Passo 2); header `Authorization` errado |
| Webhook log = **422** | Projection não é exatamente `{"event_type":"sanity-publish"}` |
| Actions roda mas **pula o deploy** | Faltam os secrets AWS (Passo 1) |
| Actions **falha** no S3/CloudFront | IAM sem permissão, ou `S3_BUCKET`/`CF_DISTRIBUTION_ID` errados |
| Deploy ok mas `/blog` dá **404/301** | Falta a **CloudFront Function** (`infra/cloudfront-subdir-index.js`) |
| Dispara **a cada tecla** digitada | Filter sem `!(_id in path("drafts.**"))` |
| Post publicado não aparece | Dataset privado? Deve estar **público** (manage → API → Datasets), ou usar read token |

---

## Arquivos relacionados no repo
- `.github/workflows/deploy.yml` — pipeline (build + S3 sync + invalidation), com cache.
- `scripts/build-all.mjs` — build combinado (site na raiz + blog em `dist/blog/`).
- `scripts/deploy-s3.sh` — deploy **manual** (sem CI): `S3_BUCKET=… CF_DISTRIBUTION_ID=… ./scripts/deploy-s3.sh`.
- `infra/cloudfront-subdir-index.js` — CloudFront Function que resolve `/blog/`, `/blog/post/…`, `/blog/studio` → `index.html`.
- `blog/` — projeto Astro do blog (Sanity Studio embutido em `/blog/studio`).
