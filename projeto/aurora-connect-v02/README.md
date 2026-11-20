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
- Usa dados do OpenStreetMap consultados pela Overpass API; busca em raio de 30 km, ordena por distância e permite calcular uma rota de carro até o local selecionado pelo OSRM público.
- Se o usuário já concedeu permissão de geolocalização, a página tenta atualizar a busca ao abrir quando há conexão; caso contrário, solicita a localização após ação do usuário. Ao voltar a conexão, atualiza os resultados.
- A localização não é rastreada continuamente. Resultados podem estar incompletos/desatualizados e o roteamento depende de serviço externo; não é navegação certificada nem instrução de segurança.
