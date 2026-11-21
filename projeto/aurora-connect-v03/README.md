# Aurora Connect V04

Evolução experimental do Aurora Connect, desenvolvida em branch independente para preservar as versões anteriores.

## Recursos disponíveis
- Mapa interativo Leaflet com OpenStreetMap e camada de imagens Esri.
- Busca de endereços via Nominatim.
- Cálculo de rotas de carro via OSRM, com geometria, distância, duração estimada e etapas.
- Localização do dispositivo por GPS.
- **Correção V04:** quando a origem é “Minha localização”, o cálculo usa as coordenadas GPS capturadas, em vez de tentar geocodificar esse texto como endereço.
- **Novo V04:** acompanhamento experimental do trajeto por GPS, marcador de posição atualizado e avanço de instruções ao se aproximar da próxima manobra.
- Orientação por voz em português via síntese de voz do navegador.
- Busca de postos, hospitais/clínicas, oficinas, borracharias, chaveiros e serviços de guincho nos dados do OpenStreetMap via Overpass.
- Interface responsiva para celular.

## Limitações e segurança
- O OSRM público fornece estimativas e não considera trânsito ao vivo.
- O acompanhamento GPS é experimental; não substitui um navegador automotivo certificado nem garante alertas de manobra em tempo real.
- Não há ainda navegação 3D, tráfego ao vivo, alertas verificados de acidentes/bloqueios ou integração com câmeras rodoviárias.
- A busca de serviços depende da cobertura e qualidade dos dados do OpenStreetMap e do Overpass.
- Geolocalização exige permissão do usuário e contexto seguro (HTTPS ou localhost).
- Use apenas como apoio, respeite a sinalização e não opere o celular enquanto dirige.

## Teste
Abra a branch `aurora-connect-v04` no preview da Vercel ou sirva a pasta em um servidor estático com internet. Teste primeiro a permissão GPS, a origem “Minha localização”, o cálculo de rota e o botão “Acompanhar trajeto”.
