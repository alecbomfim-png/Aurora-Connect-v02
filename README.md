# Aurora Connect v02

Painel responsivo de mobilidade urbana, em português, com mapa interativo, busca de lugares, geolocalização e planejamento de rotas.

## Como usar

Abra `index.html` em um navegador moderno ou publique a raiz do repositório no GitHub Pages. A conexão com a internet é necessária para carregar o mapa e consultar os serviços de geocodificação e rotas.

## Funcionalidades

- Mapa OpenStreetMap com ocorrências ilustrativas de trânsito.
- Busca de endereço ou lugar usando Nominatim.
- Planejamento de rota de carro usando OSRM, com distância e duração estimada.
- Localização do dispositivo, mediante permissão do navegador.
- Layout adaptável para celular e desktop.

## Sobre os dados de trânsito

Os marcadores, alertas e linhas coloridas de tráfego são **ilustrativos** e não representam condições reais ao vivo. O cálculo OSRM fornece uma rota e estimativa de duração, mas não inclui previsão de trânsito em tempo real. Para oferecer tráfego real, será preciso integrar um provedor de dados de trânsito e respeitar os limites e termos de uso de cada serviço. Nominatim e o servidor público OSRM são serviços comunitários e podem limitar solicitações; para produção, use provedores próprios ou serviços com SLA.

## Tecnologias

HTML, CSS, JavaScript, Leaflet, OpenStreetMap, Nominatim e OSRM. Não é necessário instalar dependências para executar a versão inicial.
