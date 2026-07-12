# Conteúdo arquivado do site

Registro de blocos removidos temporariamente do site, com o snippet original e
instruções de reativação.

---

## Depoimento Rafaela / Treméa no modal de contato (arquivado em 2026-07-12)

**Onde ficava:** `index.html`, coluna esquerda do modal de contato
(`.contact-modal-pitch`), logo após `.contact-modal-bullets`. Há um comentário
`ARQUIVADO` marcando o local exato.

**Motivo:** arquivado a pedido; será reativado futuramente.

**O que permanece no repositório (não remover):**

- CSS em `styles.css`: `.contact-modal-quote`, `.contact-modal-quote-text`,
  `.contact-modal-quote-author`, `.contact-modal-avatar`,
  `.contact-modal-avatar--photo`, `.contact-modal-author-name`,
  `.contact-modal-author-role`, `.contact-modal-tremea-logo`,
  `.cities-ticker` (+ `__track`, `__seq` e o keyframe `cities-scroll`)
- Imagens: `public/rafaela-tremea.png` e `public/tremea-logo.png`

**Para reativar:** cole o snippet abaixo no lugar do comentário `ARQUIVADO`
em `index.html`. Nenhuma mudança de CSS ou JS é necessária.

```html
<div class="contact-modal-quote">
  <p class="contact-modal-quote-text">"O sistema é super funcional e didático, além de ter um visual muito bonito, que particularmente gostei. Tínhamos problemas em visualizar de forma organizada nossas multas, e agora tem dado certo."</p>
  <div class="contact-modal-quote-author">
    <img src="/rafaela-tremea.png" alt="Rafaela, da Treméa" class="contact-modal-avatar contact-modal-avatar--photo" width="48" height="48">
    <div>
      <p class="contact-modal-author-name">Rafaela</p>
      <p class="contact-modal-author-role">Treméa · frota com 1.100+ caminhões</p>
    </div>
    <img src="/tremea-logo.png" alt="Treméa — Transporte e Logística Rodofluvial" class="contact-modal-tremea-logo" loading="lazy">
  </div>
  <div class="cities-ticker" aria-hidden="true">
    <div class="cities-ticker__track">
      <span class="cities-ticker__seq">Xaxim / SC&nbsp;&nbsp;•&nbsp;&nbsp;São Paulo / SP&nbsp;&nbsp;•&nbsp;&nbsp;Boa Vista / RR&nbsp;&nbsp;•&nbsp;&nbsp;Manaus / AM&nbsp;&nbsp;•&nbsp;&nbsp;Porto Velho / RO&nbsp;&nbsp;•&nbsp;&nbsp;Belém / PA&nbsp;&nbsp;•&nbsp;&nbsp;Santarém / PA&nbsp;&nbsp;•&nbsp;&nbsp;Macapá / AP&nbsp;&nbsp;•&nbsp;&nbsp;Buriti Alegre / GO&nbsp;&nbsp;•&nbsp;&nbsp;Recife / PE&nbsp;&nbsp;•&nbsp;&nbsp;Várzea Grande / MT&nbsp;&nbsp;•&nbsp;&nbsp;Araguaína / TO&nbsp;&nbsp;•&nbsp;&nbsp;Araporã / MG&nbsp;&nbsp;•&nbsp;&nbsp;</span>
      <span class="cities-ticker__seq">Xaxim / SC&nbsp;&nbsp;•&nbsp;&nbsp;São Paulo / SP&nbsp;&nbsp;•&nbsp;&nbsp;Boa Vista / RR&nbsp;&nbsp;•&nbsp;&nbsp;Manaus / AM&nbsp;&nbsp;•&nbsp;&nbsp;Porto Velho / RO&nbsp;&nbsp;•&nbsp;&nbsp;Belém / PA&nbsp;&nbsp;•&nbsp;&nbsp;Santarém / PA&nbsp;&nbsp;•&nbsp;&nbsp;Macapá / AP&nbsp;&nbsp;•&nbsp;&nbsp;Buriti Alegre / GO&nbsp;&nbsp;•&nbsp;&nbsp;Recife / PE&nbsp;&nbsp;•&nbsp;&nbsp;Várzea Grande / MT&nbsp;&nbsp;•&nbsp;&nbsp;Araguaína / TO&nbsp;&nbsp;•&nbsp;&nbsp;Araporã / MG&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    </div>
  </div>
</div>
```

---

## Campo "Multas no último mês (R$)" do formulário de contato (removido em 2026-07-12)

Removido do formulário (`index.html`) e do payload do webhook (`main.js`,
chave `multas_ultimo_mes`). Caso volte, o snippet original era:

```html
<div class="cmf-group">
  <label for="cmf-multas-mes" class="cmf-label">Multas no último mês (R$) *</label>
  <select id="cmf-multas-mes" name="multas_ultimo_mes" class="cmf-input cmf-select" required>
    <option value="">Selecione</option>
    <option value="0-500">R$ 0 a 500</option>
    <option value="500-1000">R$ 500 a 1.000</option>
    <option value="1000-5000">R$ 1.000 a 5.000</option>
    <option value="5000+">Mais de R$ 5.000</option>
  </select>
</div>
```

E no `main.js`, dentro do payload do submit:

```js
multas_ultimo_mes: formData.get('multas_ultimo_mes'),
```

> Nota: na mesma data as opções de "Tamanho da frota" mudaram de
> 1-20 / 21-50 / 51-100 / 100+ para 1-50 / 51-100 / 100-500 / 500-1000 / 1000-2000.
> Quem consome o webhook (`frota_tamanho`) deve esperar os novos valores.
