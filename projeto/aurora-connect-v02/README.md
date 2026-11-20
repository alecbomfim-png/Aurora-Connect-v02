# Aurora Connect v02

Aplicativo web responsivo para consulta e planejamento de mobilidade na Bahia.

## Executar

Abra `index.html` em um navegador moderno com acesso à internet. O mapa e as funções de busca/rota usam Leaflet, OpenStreetMap, Nominatim e OSRM; não há dependências de build.

## O que já funciona

- Mapa interativo centralizado em Salvador.
- Busca de lugar/endereço e localização do dispositivo.
- Cálculo de rota de carro com distância e duração estimada.
- Atalhos para os sites oficiais do Detran-BA, Seinfra-BA, PRF e DNIT.
- Layout responsivo para celular e desktop.

## Limitação importante

As linhas e ocorrências no mapa são **exemplos visuais**, não representam trânsito atual. Os links oficiais são atalhos de consulta; o app não importa nem sincroniza automaticamente os avisos publicados pelos órgãos.

## Fontes oficiais

- Detran-BA: https://www.ba.gov.br/detran/
- Seinfra-BA: http://infraestrutura.ba.gov.br/
- PRF: https://www.gov.br/prf/pt-br
- DNIT: https://www.gov.br/dnit/pt-br

## Aurora Satellite Vision

- A página `satellite-vision.html` consulta o catálogo público STAC do Copernicus Data Space para listar metadados de cenas Sentinel-2 L2A na região Pojuca–Camaçari–Salvador.
- A consulta filtra cenas com cobertura de nuvens inferior a 30% e apresenta a data de captura; a disponibilidade depende do catálogo e da conexão do navegador.
- As cenas são observações da Terra, não imagens ao vivo da estrada. Não detectam veículos, radares, pedestres ou obstáculos em tempo real e não substituem dados de trânsito oficiais.
- O módulo é experimental e fica acessível pelo botão “Satélite” no painel de navegação.

## Aurora Explore — atrativos e rotas

- `explore.html` pesquisa atrações turísticas, pontos históricos, parques e locais naturais próximos à posição GPS autorizada pelo usuário.
- Usa dados do OpenStreetMap consultados pela Overpass API; busca em raio de 30 km, ordena resultados por distância e permite calcular uma rota de carro até o local selecionado pelo OSRM público.
- Se o usuário já concedeu permissão de geolocalização, a página tenta atualizar a busca ao abrir quando há conexão; caso contrário, solicita a localização após ação do usuário. Ao voltar a conexão, atualiza os resultados.
- A localização não é rastreada continuamente. Resultados podem estar incompletos/desatualizados e o roteamento depende de serviço externo; não é navegação certificada nem instrução de segurança.

## Aurora Vision Network — catálogo e homologação de fontes

- A página `vision-network.html` organiza órgãos e portais oficiais candidatos a futuras integrações de câmeras e dados viários.
- O catálogo inicial inclui Transalvador, DETRAN-BA, SEINFRA-BA, DNIT e PRF, com links para seus portais oficiais.
- A inclusão de um órgão não confirma a existência de stream público, API, parceria ou autorização. Nesta etapa, nenhuma câmera ou transmissão ao vivo está conectada; os contadores começam em zero.
- Antes de integrar uma fonte, verificar na origem o tipo de conteúdo, cobertura, atualização, autenticação, termos de uso e autorização expressa para exibição, armazenamento, análise e redistribuição.
- Registrar timestamp e estado offline/online; nunca apresentar imagem estática ou antiga como vídeo ao vivo. Aplicar controles de privacidade e requisitos da LGPD.

## Aurora Road Intelligence — dados de trânsito e rodovias

- A página `traffic-data.html` reúne fontes públicas oficiais e padroniza os campos previstos para eventos viários.
- Integra dois arquivos JSON do catálogo de dados abertos da ANTT: cadastro de equipamentos de sensoriamento de tráfego (atualizado em 28/09/2026) e inventário de CFTV (atualizado em 28/06/2026). A página tenta carregar os arquivos diretamente; se o navegador bloquear por CORS, oferece os links originais.
- Os dados ANTT são cadastros de equipamentos, não leituras de fluxo instantâneo nem transmissões de vídeo. Inventário CFTV não equivale a stream público ou autorização para redistribuir imagens.
- Inclui atalhos oficiais para bases DNIT de condições do pavimento, obras, contagem de tráfego e controle de velocidade, além de dados abertos de acidentes da PRF (BAT), cuja frequência informada é mensal.
- Define campos de identificação, tipo, coordenadas, via, quilômetro, sentido, datas de observação/publicação, validade, status, gravidade, fonte, permissão de uso, confiança e verificação.
- Os dados históricos e periódicos são destinados a contexto e análise de risco histórico; não devem ser apresentados como ocorrências ao vivo nem alimentar alertas instantâneos sem fonte operacional atual.
- O módulo não recomenda ultrapassagens. Alertas de manobra exigirão dados atuais, confiáveis, validação independente e respeito ao CTB.

## Aurora Road Guard — alertas preventivos

- A página `road-guard.html` define a camada de avisos preventivos para curvas com histórico de acidentes, radares, limites sinalizados, lombadas, travessias, buracos, alagamentos, obras e obstáculos.
- A PRF disponibiliza dados abertos de acidentes em CSV e informa atualização mensal da base BAT. Esses dados podem apoiar análise histórica georreferenciada, inclusive por causa do acidente, mas não indicam ocorrências atuais.
- A ANTT mantém conjuntos de dados rodoviários sobre radares, sinalização de velocidade e proibição de ultrapassagem, sensores de tráfego e CFTV; cada conjunto precisa de validação de cobertura, atualização e licença antes do uso.
- Os alertas devem identificar claramente a natureza da evidência: histórico, infraestrutura cadastrada, relato recente ou fonte operacional em tempo real.
- Cada perigo terá identificador, tipo, coordenadas, via/km/sentido, nível de risco, fundamento, data de observação, validade, fonte, verificação, texto de voz e distância de antecedência.
- Eventos históricos não podem ser apresentados como acidentes atuais. Relatos de buracos e obstáculos precisam de timestamp, confirmação e expiração.
- O módulo não deve induzir frenagem brusca, desvio perigoso ou ultrapassagem; recomenda atenção, redução gradual quando segura, respeito à sinalização e manutenção de distância.
- A página atual documenta regras e exemplos; ingestão automática da PRF e alertas operacionais em tempo real ainda não estão implementados.
