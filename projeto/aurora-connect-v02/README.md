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
