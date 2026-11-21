# Aurora Connect V03 — Aurora Intelligence
## Arquitetura comparativa e plano de implementação

**Branch de destino:** `aurora-connect-v03`  
**Escopo:** planejamento técnico; não habilita provedores externos nem publica credenciais.  
**Regra de preservação:** não alterar a branch `main` nem os arquivos da V02.

## 1. Objetivo

Evoluir o Aurora Connect para uma central de mobilidade que combine:
- mapa e navegação próprios;
- cálculo e comparação de rotas;
- condições de tráfego e incidentes de fontes autorizadas;
- relatos comunitários moderados;
- avisos contextuais por voz;
- assistência ao motorista ao longo do percurso.

A interface 3D aprovada continua sendo a experiência principal. A barra de assistência permanece discreta abaixo da área de condução, sem cobrir a estrada nem os elementos de navegação.

## 2. Comparativo dos provedores

### TomTom — candidato prioritário para tráfego
**Capacidades documentadas:** Traffic Flow (velocidade observada, velocidade de fluxo livre e indicador de qualidade); Traffic Incidents (incidentes dentro de uma área/viewport); tiles raster/vetoriais para representar fluxo e ocorrências. A documentação consultada recomenda as APIs TomTom Orbis para novas integrações e descreve migração das versões anteriores.

**Uso proposto:** camada de tráfego e incidentes sobre o mapa, com atualização controlada pelo backend. Antes de contratar/adotar, executar prova de cobertura e qualidade em Salvador, RMS e corredor Salvador–Pojuca.

**Custo/limites:** a página de preços consultada exibe cotas gratuitas mensais específicas por produto (por exemplo, 2.500 para Traffic Incidents, 200 mil para tiles de fluxo e 20 mil para dados de segmento), sujeitas ao produto, contrato e alteração do fornecedor. Confirmar preços e condições atuais no cadastro antes de produção.

### Google Maps Platform — candidato para comparação de rotas/ETA
**Capacidades documentadas:** Routes API com `TRAFFIC_UNAWARE`, `TRAFFIC_AWARE` e `TRAFFIC_AWARE_OPTIMAL`; as duas últimas consideram trânsito ao vivo, com maior latência/custo. Polylines com informação de tráfego também podem ter cobrança superior.

**Uso proposto:** comparar ETA/alternativas em uma integração isolada, atrás de feature flag, e somente após avaliação de custo, cobertura e termos de exibição/armazenamento.

**Custo/limites:** exige projeto Google Cloud, faturamento habilitado e chave/token. A cobrança depende do SKU e dos recursos usados; definir quotas e alertas de orçamento antes de qualquer teste externo.

**Compatibilidade:** não misturar dados/rotas do Google com mapa OpenStreetMap ou outro provedor sem validação jurídica e técnica das condições aplicáveis. Manter atribuição, armazenamento e apresentação conforme os termos do Google.

### Waze — caminho de parceria, não API pública irrestrita
**Capacidades documentadas:** Waze for Cities e feeds para parceiros tratam de alertas, perigos, veículos e fechamentos de vias. Os feeds de parceiros podem usar CIFS e outros formatos sujeitos à aprovação.

**Uso proposto:** investigar elegibilidade do Aurora Connect/operador como parceiro e solicitar acesso formal. Não depender de scraping, engenharia reversa, endpoints privados ou extração do aplicativo de consumo. Não prometer acesso a dados Waze antes de aprovação expressa.

### Síntese
1. Provar TomTom primeiro para fluxo e incidentes.
2. Avaliar Google Routes separadamente para rotas/ETA e custo.
3. Iniciar contato/avaliação de elegibilidade no Waze for Cities em paralelo, sem bloquear o produto.
4. Manter OSRM como roteador atual/fallback inicial enquanto a integração comercial é validada.

## 3. Arquitetura proposta

```
Fontes externas autorizadas
  ├─ TomTom Traffic Flow / Incidents
  ├─ Google Routes (opcional, isolado)
  ├─ Waze for Cities (se aprovado)
  └─ OpenStreetMap / OSRM
             |
             v
Backend Aurora Intelligence
  ├─ Adaptadores por provedor
  ├─ Normalização de incidentes
  ├─ Cache, limites e observabilidade
  ├─ Validação de localização/tempo
  ├─ Deduplicação e nível de confiança
  ├─ Moderação e denúncias comunitárias
  └─ Política de privacidade e retenção
             |
             v
API própria do Aurora Connect
  ├─ Estado de tráfego por viewport/rota
  ├─ Alertas e eventos
  ├─ Relatos comunitários
  ├─ Alternativas de rota / ETA
  └─ Preferências de voz
             |
             v
Aplicativo
  ├─ Mapa/rota e tráfego em camadas
  ├─ Alertas visuais discretos
  ├─ Orientação por voz
  └─ Barra de assistência
```

### Contratos internos sugeridos

**TrafficIncident**
- `id`, `provider`, `providerEventId`
- `type`, `severity`, `description`
- `geometry` (coordenadas), `direction`, `roadName`
- `observedAt`, `expiresAt`, `lastUpdatedAt`
- `confidence`, `verificationCount`, `status`

**TrafficSegment**
- `provider`, `geometry`, `currentSpeed`, `freeFlowSpeed`
- `travelTime`, `confidence`, `observedAt`

**CommunityReport**
- `id`, `category`, `coordinates`, `direction`
- `createdAt`, `expiresAt`, `status`
- `anonymousReporterToken` (pseudônimo, sem expor identidade)
- `confirmations`, `dismissals`, `moderationState`

**RouteOption**
- `provider`, `geometry`, `distanceMeters`, `durationSeconds`
- `durationInTrafficSeconds` (nullable), `warnings`, `computedAt`

Não exibir campos ausentes como se fossem dados ao vivo. Todo evento deve carregar origem e horário de atualização; mostrar “sem dados recentes” quando estiver desatualizado.

## 4. Relatos comunitários — segurança e qualidade

Categorias iniciais: acidente, congestionamento, obra/interdição, buraco, objeto na pista, veículo parado e perigo na via.

Fluxo:
1. Usuário escolhe categoria; localização GPS é sugerida e pode ser corrigida.
2. Aplicativo pede confirmação antes de enviar.
3. Backend aplica limite de frequência, valida coordenadas e remove duplicatas próximas.
4. Relatos recebem prazo de expiração por categoria e são reavaliados.
5. Confirmações independentes elevam confiança; denúncias e sinais contraditórios reduzem confiança ou enviam para moderação.
6. Eventos não verificados aparecem como “relato de usuário”, nunca como fato confirmado.

Não incentivar digitação durante a condução. A contribuição deve ser feita por voz, por passageiro ou com o veículo parado. Não armazenar áudio bruto por padrão.

## 5. Alertas por voz

- Usar síntese de voz nativa do navegador/dispositivo inicialmente (SpeechSynthesis), com idioma pt-BR quando disponível.
- Prioridades: perigo imediato; desvio/rota; trânsito; assistência próxima.
- Evitar repetição: chave de deduplicação por evento + janela de silêncio configurável.
- Ler apenas mensagens curtas e acionáveis; não narrar todos os pontos.
- Respeitar modo silencioso, volume, acessibilidade e preferências do motorista.
- Não operar ou solicitar interação manual que distraia o motorista.

Exemplos: “Atenção: possível acidente adiante”; “Trânsito lento à frente. Há uma rota alternativa”; “Posto disponível a dois quilômetros, à direita”. Só anunciar quando a fonte, distância e direção forem confiáveis.

## 6. Segurança, privacidade e operação

- Chaves TomTom/Google ficam exclusivamente no backend (variáveis de ambiente); nunca no HTML, bundle ou repositório.
- Restringir chaves por API, origem/IP quando suportado, quotas e orçamento.
- Não coletar trajetos históricos identificáveis sem finalidade, consentimento e política de retenção explícita.
- Minimizar dados pessoais; localização precisa é dado sensível no contexto operacional e deve ter acesso restrito.
- Registrar fonte, timestamp e versão dos dados para auditoria.
- Implementar timeout, retry com backoff, circuit breaker e cache dentro das licenças.
- Se um provedor falhar, manter mapa/rota básica e indicar claramente que o tráfego ao vivo está indisponível.
- Verificar cobertura real no Brasil/Bahia, atribuição, direitos de armazenamento, exibição e redistribuição antes do lançamento.

## 7. Plano de implementação na V03

### Fase 0 — estabilidade (bloqueadora)
- Recuperar mapa base no Safari/iPhone.
- Validar geocodificação e rota Salvador–Pojuca.
- Testar resize/orientação, tiles, erros de rede e fallback OSRM.
- Distinguir dados demonstrativos de dados reais.
**Aceite:** ruas visíveis; origem/destino corretos; linha de rota desenhada; distância/ETA; falhas com mensagem clara.

### Fase 1 — prova TomTom
- Criar conta/projeto e chave de teste fora do repositório.
- Confirmar produtos Orbis atuais e termos.
- Implementar adaptador backend Traffic Flow e Incidents.
- Fazer testes de viewport e corredor Salvador–Pojuca em horários distintos.
- Medir cobertura, atualização, latência, falsos positivos e custo.
**Aceite:** camada identificada como TomTom, timestamps visíveis e fallback seguro.

### Fase 2 — comparação Google
- Prototipar Routes API em backend isolado.
- Comparar rota/ETA com OSRM e TomTom, sem misturar dados incompatíveis.
- Criar quotas, alertas de orçamento e feature flag.
**Aceite:** relatório comparativo de cobertura, latência, qualidade e custo; decisão documentada antes de habilitar usuários.

### Fase 3 — Waze for Cities
- Verificar elegibilidade e submeter solicitação de parceria.
- Se aprovado, integrar somente feeds e campos autorizados.
- Se não aprovado, manter a arquitetura independente do Waze.
**Aceite:** autorização formal e contrato técnico aprovado; sem scraping ou dependência de endpoints privados.

### Fase 4 — comunidade e moderação
- Criar envio, confirmação, denúncia, deduplicação, expiração e painel de moderação.
- Começar com piloto limitado e controles antiabuso.
**Aceite:** eventos rotulados corretamente, expiração automática e trilha de auditoria.

### Fase 5 — voz e orientação
- Integrar TTS pt-BR, prioridades, deduplicação e configurações.
- Testar no Safari iOS e Android; validar restrições de autoplay/gestos do navegador.
**Aceite:** avisos curtos, não repetitivos e acionados por eventos válidos; fallback visual se voz indisponível.

### Fase 6 — piloto e lançamento
- Teste controlado em Salvador, Pojuca e trechos próximos.
- Monitorar disponibilidade, latência, custo, erros e qualidade dos relatos.
- Liberar gradualmente com botão de desativação por provedor.

## 8. Critérios globais de aceite

- V02 permanece intacta na branch `main`.
- Todo desenvolvimento e documentação ficam na branch `aurora-connect-v03`.
- Nenhuma chave secreta é versionada.
- Dados reais, estimados, demonstrativos e comunitários são visualmente distintos.
- O app continua útil sem qualquer provedor externo.
- Testes no iPhone/Safari e em Android antes do lançamento.
- Nenhuma integração é anunciada como ativa até passar pelo teste real e revisão de termos/custos.

## 9. Referências oficiais consultadas

- TomTom Traffic API: https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/product-information/introduction
- TomTom Traffic Flow: https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/traffic-flow/traffic-flow-service
- TomTom Traffic Incidents: https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/traffic-incidents/traffic-incidents-service
- TomTom Pricing: https://docs.tomtom.com/pricing
- Google Routes traffic preferences: https://developers.google.com/maps/documentation/routes/config_trade_offs
- Google Routes billing: https://developers.google.com/maps/documentation/routes/usage-and-billing
- Google Maps Platform pricing: https://developers.google.com/maps/billing-and-pricing/pricing
- Waze partner feeds: https://developers.google.com/waze/data-feed/overview

---
**Status deste documento:** arquitetura e plano preparados; integrações externas ainda não ativadas. A prioridade de execução é a Fase 0.
