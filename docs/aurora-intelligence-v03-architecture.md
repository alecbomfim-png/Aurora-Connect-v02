# Aurora Connect V03 — Aurora Intelligence
## Arquitetura proposta e plano de implementação

**Branch:** `aurora-connect-v03`  
**Escopo:** integrar trânsito TomTom, relatos comunitários e alertas por voz sem alterar a V02.

## 1. Objetivo

Adicionar ao Aurora Connect uma camada própria de inteligência de mobilidade que combine:
- mapa-base e serviços geográficos OpenStreetMap;
- tráfego oficial/comercial TomTom, quando habilitado por chave e cobertura;
- rotas atuais OSRM durante a fase de transição;
- relatos enviados pelos motoristas, com validação e expiração;
- avisos sonoros contextuais em português do Brasil.

Nenhum dado de trânsito deve ser apresentado como “ao vivo” se a fonte, a cobertura ou a atualização não puderem ser confirmadas. Cada ocorrência deve carregar fonte, horário de atualização e estado de confiança.

## 2. Arquitetura lógica

```text
TomTom Traffic API ─────┐
OSM / OSRM ─────────────┤
Relatos dos motoristas ├──> Aurora Intelligence API ──> Validação / normalização
GPS do aparelho ───────┤                                  │
                       ┘                                  v
                                                API de eventos e rota
                                                          │
                     ┌────────────────────────────────────┼────────────────────┐
                     v                                    v                    v
                Mapa Leaflet                       Painel de rota       Alertas por voz
              tráfego/incidentes                  ETA / alternativas   Web Speech API
```

### Componentes

1. **Frontend V03 (Leaflet):** mantém o mapa-base atual e exibe camadas independentes para fluxo TomTom, incidentes TomTom e relatos comunitários. O usuário pode ativar/desativar cada camada.
2. **API serverless na Vercel:** funções em `/api` fazem chamadas autenticadas aos provedores. A chave TomTom fica exclusivamente em variável de ambiente (`TOMTOM_API_KEY`), nunca no HTML, JavaScript entregue ao navegador, repositório ou URL pública.
3. **Adaptador TomTom:** encapsula endpoints e formato do provedor. Preferir a documentação TomTom Orbis Traffic API para novas integrações; validar cobertura e compatibilidade de tiles/estilos com o mapa-base antes de escolher raster ou vector.
4. **Motor de relatos:** recebe, valida, limita frequência, deduplica e expira relatos. Começar com armazenamento persistente (ex.: Vercel Postgres ou Supabase) antes de habilitar envio público; não usar memória local do navegador como se fosse compartilhamento entre usuários.
5. **Motor de alertas:** transforma eventos relevantes próximos da rota em mensagens curtas pt-BR, com deduplicação, distância mínima, cooldown e opção de silenciar.

## 3. Integração TomTom

### Primeira entrega: tráfego visual
- Criar endpoint server-side que consulta TomTom Traffic Flow e Traffic Incidents para o viewport/área visível.
- Retornar ao frontend somente os dados necessários para renderização, respeitando termos, atribuição, limites e cache permitidos pela licença.
- Exibir fluxo por cores e incidentes com ícones/legenda; toque abre detalhes como categoria, via, atraso e última atualização quando fornecidos pela API.
- Consultar a documentação atual do TomTom Orbis Traffic API e suas notas de migração. A documentação consultada recomenda Orbis para novas integrações; confirmar se o produto está em preview e suas restrições antes de produção.
- Adicionar estados explícitos: “Trânsito TomTom atualizado às …”, “sem cobertura/dados” e “serviço indisponível”. Nunca converter ausência de dados em “via livre”.

### Segunda entrega: rotas conscientes do trânsito
- Fazer avaliação técnica e comercial da TomTom Routing API com tráfego, comparando com OSRM em rotas de teste na Bahia.
- Comparar distância, ETA, desvios e disponibilidade. Não substituir OSRM até os testes confirmarem cobertura, termos, custos e qualidade.
- Manter adaptador de roteamento para permitir trocar/combinar provedores sem acoplar o frontend a um único fornecedor.

## 4. Relatos comunitários

### Categorias iniciais
Acidente, congestionamento, obra/interdição, buraco, objeto na pista, veículo parado e perigo na via.

### Fluxo de publicação
1. Motorista escolhe categoria e confirma posição GPS (ou ajusta o pin no mapa).
2. Cliente envia categoria, coordenadas, horário, direção/sentido opcional e observação curta.
3. API valida coordenadas, tamanho do texto, limites por usuário/dispositivo e frequência.
4. Backend agrupa relatos próximos da mesma categoria em uma ocorrência, sem expor dados pessoais.
5. Outros motoristas podem confirmar ou indicar que o evento terminou.
6. Ocorrências expiram automaticamente conforme categoria e tempo sem confirmação; incidentes perigosos podem exigir confirmação adicional.

### Confiança e segurança
- Mostrar rótulos “relato de motorista” e “confirmado por …”, nunca misturar com evento oficial TomTom.
- Armazenar apenas o mínimo necessário; não publicar identidade, telefone ou identificador pessoal.
- Implementar rate limiting, proteção contra spam, moderação e trilha de auditoria.
- Não permitir que um relato isolado provoque automaticamente desvio crítico; tratar como alerta informativo até ganhar confiança.
- Obter consentimento de localização e explicar retenção/uso de dados conforme LGPD.

## 5. Alertas por voz

A V03 já possui leitura manual de instruções com `speechSynthesis`. Evoluir sem iniciar fala automaticamente antes de uma interação do usuário, pois navegadores móveis podem bloquear áudio sem gesto explícito.

- Preferência: voz ligada/desligada, volume/velocidade quando suportados e botão “silenciar”.
- Prioridade: perigo imediato > bloqueio/acidente na rota > congestionamento significativo > instrução de manobra.
- Mensagens curtas em pt-BR; evitar repetição do mesmo evento.
- Anunciar apenas eventos próximos e relevantes à rota/sentido, com cooldown e distância configuráveis.
- Se a voz não estiver disponível, manter aviso visual/vibração quando suportada.
- Nunca incentivar interação manual durante a condução.

## 6. Segurança, privacidade e operação

- Segredos apenas em variáveis de ambiente Vercel; não colocar chave TomTom no bundle público.
- Endpoints com validação de parâmetros, limites de requisição, cache e tratamento de erros.
- Cache e retenção devem respeitar a licença TomTom e as regras do provedor; confirmar condições comerciais antes de definir TTL.
- Atribuição/copyright de cada provedor visível na interface.
- Consentimento explícito para GPS e relatos; minimização e política de retenção conforme LGPD.
- Telemetria técnica sem dados pessoais desnecessários.
- Fallback: se TomTom falhar, manter mapa/rota OSRM e mostrar claramente que o tráfego ao vivo está indisponível.

## 7. Plano de implementação por etapas

### Fase 0 — preparação (agora)
- Manter todo o trabalho na branch `aurora-connect-v03`.
- Não alterar `main`, V02 ou seu deployment.
- Criar projeto/chave TomTom, confirmar produtos habilitados, cobertura na Bahia, quotas, atribuição e preço.
- Configurar `TOMTOM_API_KEY` como segredo de ambiente na Vercel (Preview/Production conforme necessário).

### Fase 1 — prova de conceito TomTom
- Criar endpoint serverless para Flow e Incident.
- Testar viewport em Salvador–Pojuca e em trechos urbanos/rodoviários da Bahia.
- Validar CORS, autenticação, limites, latência, cobertura, atribuição e renderização sobre Leaflet/OSM.
- Não liberar chave no navegador.

### Fase 2 — interface de trânsito
- Adicionar controles “Fluxo”, “Ocorrências” e “Relatos”.
- Desenhar fluxo/incidentes e painel de detalhes com fonte e horário.
- Testar fallback e ausência de dados.

### Fase 3 — relatos comunitários
- Configurar banco persistente, endpoint de criação/listagem/confirmação e moderação.
- Criar formulário compacto e marcadores no mapa.
- Testar duplicidade, spam, expiração e privacidade.

### Fase 4 — voz contextual
- Aproveitar `speechSynthesis` existente.
- Implementar preferências, prioridades, cooldown e deduplicação.
- Testar Safari iOS com tela ativa, permissões e restrições de reprodução.

### Fase 5 — roteamento com trânsito
- Comparar TomTom Routing com OSRM em rotas reais de teste.
- Só promover TomTom a roteador principal após validação funcional, cobertura, custos e licença.
- Manter fallback OSRM e informar claramente a fonte do ETA.

## 8. Critérios de aceite

1. A V02 permanece inalterada e acessível.
2. V03 continua carregando o mapa e calculando Salvador → Pojuca mesmo sem chave TomTom.
3. Com chave válida, camadas TomTom mostram dados reais disponíveis e a hora/fonte; sem dados, não fingem fluxo livre.
4. A chave não aparece no HTML, JavaScript público, logs ou Git.
5. Relatos persistem e são visíveis entre dispositivos apenas após backend/banco estarem configurados.
6. Relatos têm categoria, localização, hora, estado de confiança e expiração.
7. Alertas por voz respeitam preferências, não repetem indefinidamente e não dependem de áudio automático bloqueado pelo navegador.
8. Falha de TomTom não derruba mapa, rota OSRM ou interface principal.

## 9. Dependências ainda necessárias

- Conta e chave TomTom com Traffic Flow/Incidents habilitados.
- Projeto Vercel com acesso para configurar variáveis de ambiente e funções serverless.
- Escolha/configuração de banco persistente para relatos comunitários.
- Verificação de termos, preços, quotas, cobertura e atribuição antes de produção.

**Estado desta entrega:** documento de arquitetura e plano registrados na branch V03. Nenhuma chave TomTom foi criada ou adicionada; nenhuma integração de trânsito real ou armazenamento comunitário é declarada como ativa nesta etapa.
