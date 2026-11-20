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

As linhas e ocorrências no mapa são **exemplos visuais**, não representam trânsito atual. Os links para os órgãos são atalhos de consulta; o app **não lê, importa nem sincroniza automaticamente** informações dos sites. Uma integração automática futura depende de dados abertos, API/feed oficial ou autorização, além de verificação dos termos de uso e da confiabilidade/atualidade dos avisos. As rotas OSRM não incluem previsão de congestionamento.

## Fontes oficiais

- Detran-BA: https://www.ba.gov.br/detran/
- Seinfra-BA: http://infraestrutura.ba.gov.br/
- PRF: https://www.gov.br/prf/pt-br
- DNIT: https://www.gov.br/dnit/pt-br

Os serviços públicos OpenStreetMap/Nominatim/OSRM podem impor limites de uso; para produção, avalie provedores com disponibilidade e condições adequadas.
