# Aurora Connect — arquivo de continuidade do projeto

**Data do checkpoint:** 21/11/2026  
**Repositório:** `alecbomfim-png/Aurora-Connect-v02`  
**Branch de trabalho:** `aurora-connect-v03`  
**Regra inviolável:** preservar `main`/V02; todo desenvolvimento novo somente na V03. Não publicar nem alterar Vercel sem autorização e validação.

Este documento é o ponto de retomada do projeto. Leia-o antes de qualquer nova implementação.

## 1. Objetivo do produto

Construir o Aurora Connect como aplicativo de navegação e assistência ao motorista, com navegação geográfica real, leitura de trânsito, rotas, alertas por voz e serviços úteis próximos.

## 2. Referência visual obrigatória

A imagem aprovada pelo usuário em 21/11/2026 é a referência visual oficial. Ela deve ser preservada como modelo de experiência:

- tela principal imersiva 3D, perspectiva da estrada vista do veículo;
- identidade Aurora Connect em preto e verde neon;
- veículo do usuário, pista, faixas, sinalização e tráfego;
- painéis de próxima manobra, destino, distância, duração, velocidade e limite;
- alertas de radar, semáforo, perigos e avisos;
- mini mapa 2D auxiliar no canto inferior;
- controles de voz e alternância mapa 2D/3D;
- barra inferior de navegação.

Não substituir por mapa convencional, layout genérico ou estética diferente. O mapa 2D é auxiliar; não deve dominar a tela. Os seis atalhos de assistência — posto, hospital, mecânico, borracharia, guincho e chaveiro — devem ficar discretos abaixo da área de condução, sem cobrir estrada ou navegação. Ao tocar em um atalho, mostrar estabelecimentos próximos e, quando disponíveis, telefone, endereço, horário, avaliação e opção de rota/ligação.

**Observação:** a imagem de referência permanece no histórico da conversa do usuário; ao retomar, solicitar que seja anexada novamente caso não esteja disponível no contexto ativo.

## 3. Decisões já aprovadas

- GPS como origem padrão; iniciar o cálculo ao informar destino.
- Permitir origem e destino alternativos.
- Manter OpenStreetMap como base aberta, com atribuição e infraestrutura adequada.
- Arquitetura visual/técnica desejada: MapLibre + Three.js, mantendo o painel 3D próprio.
- Primeira entrega funcional deve combinar motor GPS/rota e visualização 3D.
- Valhalla é o candidato recomendado para evolução do motor de rotas; OSRM pode permanecer como protótipo/fallback enquanto validamos.
- Comparar TomTom, Google e Waze para trânsito/rotas. TomTom é o primeiro candidato para prova de trânsito; Google Routes deve ser avaliado isoladamente; Waze for Cities depende de parceria/autorização.
- Incluir relatos comunitários com moderação, deduplicação, expiração e indicação clara de confiança.
- Incluir alertas por voz em português do Brasil, com prioridade e controle de repetição.
- Diferenciar sempre dados reais, estimados, comunitários e simulados. Não apresentar carros simulados como tráfego real.
- O Google Places pode enriquecer fichas de estabelecimentos, mas depende de projeto, APIs, faturamento, chaves seguras, FieldMask, termos e custos verificados. Nunca expor chaves no front-end.
- Testar especialmente em iPhone/Safari e Android, com atenção à experiência móvel.

## 4. Estado técnico verificado neste checkpoint

### Documento de arquitetura existente
O arquivo `docs/AURORA-INTELLIGENCE-PLAN.md` existe na branch `aurora-connect-v03`. Ele descreve comparação TomTom/Google/Waze, backend adaptador, contratos de dados, relatos comunitários, voz, segurança e fases de implementação. O próprio documento indica que as integrações externas ainda não estão ativadas e que a Fase 0 é a prioridade.

### Aplicação V03 examinada
Arquivo: `projeto/aurora-connect-v03/index.html`.

O código atualmente contém:
- Leaflet com tiles OpenStreetMap e alternativa HOT;
- geocodificação Nominatim com fallback Photon;
- cálculo de rota por OSRM público, com fallback para routing.openstreetmap.de;
- captura de GPS sob permissão do navegador;
- distância, duração e estimativa de chegada calculadas a partir da rota;
- instruções de manobra retornadas pelo OSRM;
- síntese de voz do navegador para leitura manual da próxima instrução;
- busca de serviços próximos via Overpass/OpenStreetMap para postos, hospitais/clínicas, oficinas, borracharias, chaveiros e guinchos;
- mapa satélite opcional via serviço Esri.

Limitações verificadas no código:
- a interface atual é essencialmente um mapa Leaflet 2D, não o painel 3D aprovado;
- não há MapLibre + Three.js implementados;
- não há motor Valhalla integrado;
- não há trânsito ao vivo ou incidentes conectados;
- a voz é acionada manualmente, não há orientação contínua confiável por GPS;
- serviços próximos exibem nome e distância aproximada em linha reta; telefone, horários, avaliações e ficha completa não estão integrados;
- os serviços públicos externos usados no protótipo têm limites/disponibilidade que não devem ser tratados como infraestrutura garantida de produção;
- a rota pública OSRM não deve ser considerada serviço de produção.

**Não afirmar que o Aurora Connect já possui navegação 3D, trânsito ao vivo, alertas reais, integração TomTom/Google/Waze ou Google Places. Ainda não estão implementados neste código.**

## 5. Plano de execução a partir da retomada

### Fase 0 — estabilizar o protótipo atual
- testar no iPhone/Safari e Android;
- verificar GPS, geocodificação, rota, ETA, resize/orientação e falhas de rede;
- validar trajetos reais na região de Pojuca/Bahia e corredor Salvador–Pojuca;
- separar visualmente dados demonstrativos, estimados e reais;
- documentar limitações de serviços públicos.

### Fase 1 — base geográfica e visual 3D
- integrar MapLibre com fonte de dados/tiles apropriada;
- integrar Three.js para a estrada em perspectiva, veículo, sinalização e objetos;
- manter geometria e orientação vinculadas à rota real e ao GPS;
- preservar a referência visual aprovada e o mini mapa 2D auxiliar;
- usar veículos de tráfego simulados somente com identificação explícita.

### Fase 2 — motor de navegação
- provar Valhalla em backend controlado;
- comparar com OSRM e GraphHopper;
- fornecer rota, manobras, distância, duração, saída e ETA;
- implementar map matching e atualização da posição/rota;
- testar recálculo e perda de GPS.

### Fase 3 — trânsito real
- testar TomTom Traffic Flow e Incidents no corredor Salvador–Pojuca e em horários diferentes;
- avaliar cobertura, atualidade, latência, falsos positivos, custo e termos;
- comparar Google Routes com trânsito em integração isolada;
- investigar acesso formal ao Waze for Cities;
- não fazer scraping nem usar endpoints privados.

### Fase 4 — assistência e lugares
- manter os seis atalhos discretos;
- pesquisar locais por categoria e proximidade;
- integrar Google Places ou outra fonte autorizada para detalhes de contato;
- mostrar distância pela rota e tempo estimado quando disponíveis;
- permitir abrir rota, ligar e consultar ficha do local;
- observar atribuição, FieldMask, privacidade e custos.

### Fase 5 — comunidade e voz
- relatos de acidente, congestionamento, obra, buraco, objeto na pista e veículo parado;
- confirmação/denúncia, deduplicação, expiração e moderação;
- voz pt-BR com prioridades, supressão de repetição e fallback visual;
- evitar interação manual durante a condução.

### Fase 6 — piloto e lançamento
- testes controlados em Pojuca, Salvador e trechos próximos;
- monitorar disponibilidade, latência, qualidade, custo e erros;
- liberar gradualmente, com fallback quando provedores externos falharem;
- só considerar pronto após testes documentados em iPhone/Safari e Android.

## 6. Regras de trabalho

1. Nunca modificar `main`/V02 durante a evolução da V03.
2. Não sobrescrever trabalho existente sem ler o arquivo atual e usar seu SHA atualizado.
3. Fazer alterações pequenas, revisáveis e com commits claros na branch V03.
4. Não inserir chaves, tokens ou credenciais no repositório/front-end.
5. Não publicar deployment Vercel sem autorização expressa do usuário.
6. Não dizer que algo foi implementado, testado, commitado ou publicado sem confirmação da ferramenta e evidência de teste.
7. Antes de integrar APIs comerciais, verificar documentação, cobertura brasileira, termos, quotas e preços atuais.
8. Preservar o layout de referência em todas as telas e etapas.

## 7. Como retomar

O usuário pode voltar e dizer:

**“Vamos retomar o Aurora Connect do arquivo de continuidade. Preserve a V02 e continue na V03 a partir da Fase 0.”**

Ao receber essa instrução:
1. reler este documento e `docs/AURORA-INTELLIGENCE-PLAN.md`;
2. verificar o estado atual da branch e dos arquivos antes de editar;
3. confirmar o que mudou desde este checkpoint;
4. retomar a menor tarefa técnica verificável, sem repetir decisões já aprovadas.

---
**Status:** checkpoint documental criado. Este arquivo não significa que as fases técnicas estejam implementadas nem que o deployment tenha sido alterado.
