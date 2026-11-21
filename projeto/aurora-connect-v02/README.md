# Aurora Connect — evolução V03

Esta branch separa o trabalho de evolução da versão publicada. A versão V02 permanece preservada.

## Base existente (V02)

- Mapa Leaflet com dados cartográficos do OpenStreetMap.
- Busca de endereços via Nominatim.
- Cálculo de rota estimada via OSRM.
- Atalho para localização do dispositivo, quando autorizado.
- Interface responsiva e links para órgãos oficiais.

## Escopo de desenvolvimento V03

1. **Condução:** interface móvel com perspectiva 3D estilizada da via, indicação da próxima manobra e painel de velocidade quando houver dados confiáveis.
2. **GPS:** solicitar permissão de localização no navegador, mostrar claramente quando o GPS estiver ativo e tratar erros/permissões negadas.
3. **Rotas:** manter OSRM como estimador inicial, apresentando distância e duração como estimativas, sem afirmar que representam trânsito ao vivo.
4. **Voz:** oferecer leitura de instruções com a API de síntese de voz do navegador, com controle explícito para ligar/desligar.
5. **Assistência:** pesquisar postos, hospitais, oficinas, borracharias, chaveiros e guinchos próximos por dados do OpenStreetMap/Overpass, quando disponíveis; mostrar distância aproximada e permitir centralizar o mapa no estabelecimento.
6. **Segurança e transparência:** diferenciar dados reais, estimativas e exemplos visuais; não exibir alertas de trânsito ou radares fictícios como se fossem ocorrências confirmadas.

## Critérios mínimos de validação antes de publicar

- Testar em Safari no iPhone e em um navegador desktop.
- Confirmar permissões de localização e comportamento quando negadas.
- Testar busca e rota com origem/destino válidos e inválidos.
- Testar indisponibilidade/limite dos serviços externos.
- Verificar legibilidade, botões e rolagem em telas pequenas.
- Só divulgar a URL V03 depois de confirmar deployment concluído e abrir a URL pública.

## Limitações conhecidas da base

A V02 não integra feeds oficiais de incidentes em tempo real. OSRM fornece uma rota e duração estimadas; Nominatim geocodifica endereços; Overpass consulta objetos mapeados no OpenStreetMap, cuja cobertura varia por região. Nenhum desses serviços, isoladamente, fornece trânsito ao vivo ou garante cobertura completa de estabelecimentos.

## Fontes e serviços

- OpenStreetMap: https://www.openstreetmap.org/
- Leaflet: https://leafletjs.com/
- Nominatim: https://nominatim.org/
- OSRM: https://project-osrm.org/
- Overpass API: https://overpass-api.de/
