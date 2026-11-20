# Aurora Connect v02

Aplicativo web responsivo para consulta e planejamento de mobilidade na Bahia.

## Executar

Abra `index.html` em um navegador moderno com acesso à internet. O mapa e as funções de busca/rota usam Leaflet, OpenStreetMap, Nominatim e OSRM; não há dependências de build.

## Instalar como aplicativo (PWA)

A aplicação está sendo preparada como Progressive Web App (PWA), com manifesto, ícone e service worker para guardar a estrutura básica e os arquivos locais em cache. A instalação só fica disponível quando o site estiver publicado em HTTPS (ou em ambiente local de desenvolvimento).

- **iPhone/iPad:** abrir o endereço publicado no Safari, tocar em Compartilhar e escolher “Adicionar à Tela de Início”.
- **Android:** abrir no navegador compatível e usar “Instalar aplicativo” ou “Adicionar à tela inicial”.
- **Computador:** usar a opção “Instalar” apresentada por navegadores compatíveis.

O mapa, a busca de endereços e o cálculo de rotas dependem de serviços externos e de conexão com a internet. O cache do aplicativo não significa que mapas e rotas funcionem integralmente offline. A publicação ainda depende da configuração de hospedagem HTTPS e de testes reais nos dispositivos.

## O que já funciona

- Mapa interativo centralizado em Salvador.
- Alternância entre mapa de ruas OpenStreetMap e imagens de satélite Esri World Imagery.
- Busca de lugar/endereço e localização do dispositivo.
- Cálculo de rota de carro com distância e duração estimada.
- Atalhos para os sites oficiais do Detran-BA, Seinfra-BA, PRF e DNIT.
- Layout responsivo para celular e desktop.

## Road Sense — visão 3D

O arquivo `prototipo-road-sense-3d.html` apresenta um conceito visual de pista em perspectiva 3D, com veículos ilustrativos nos dois sentidos e um alerta demonstrativo acionado manualmente. A aplicação principal inclui um link para abrir esse protótipo.

**Limite de segurança:** o protótipo não usa câmera, radar, sensores ou dados de outros veículos; não detecta veículos reais e não deve ser usado durante a condução. O alerta é apenas ilustrativo e não garante prevenção de colisões. Uma futura assistência real exigirá hardware apropriado, processamento validado, testes em ambiente controlado e avaliação independente de segurança.

## Limitações do aplicativo

As linhas e ocorrências no mapa são **exemplos visuais**, não representam trânsito atual. O cálculo de rota usa serviços públicos de demonstração e não fornece trânsito ao vivo nem garantia de disponibilidade. Os links oficiais são atalhos de consulta; o app não importa nem sincroniza automaticamente os avisos publicados pelos órgãos.

## Revisão técnica

As correções de segurança e o protótipo estão na branch `security/hardening-2026-11-20`, para revisão por pull request. A branch `main` permanece preservada até aprovação explícita. As verificações realizadas até aqui são estáticas; ainda faltam testes funcionais em navegador real e validação em dispositivos.

## Fontes oficiais

- Detran-BA: https://www.ba.gov.br/detran/
- Seinfra-BA: http://infraestrutura.ba.gov.br/
- PRF: https://www.gov.br/prf/pt-br
- DNIT: https://www.gov.br/dnit/pt-br
