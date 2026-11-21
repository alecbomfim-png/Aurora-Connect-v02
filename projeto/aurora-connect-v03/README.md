# Aurora Connect V03

Nova etapa experimental em uma branch separada, preservando a V02 na branch main.

## Recursos
- Mapa Leaflet com OpenStreetMap e opção de imagem de satélite.
- Busca de endereços e localização do dispositivo.
- Cálculo de rota via OSRM, com distância, duração e etapas.
- Orientação por voz em português usando a síntese de voz do navegador.
- Busca de postos, hospitais/clínicas, oficinas, borracharias e chaveiros no OpenStreetMap via Overpass.
- Interface responsiva para celular.

## Limitações
- O tempo do OSRM é estimado e não considera trânsito ao vivo.
- A busca depende dos dados cadastrados no OpenStreetMap; ausência de resultado não prova ausência do estabelecimento.
- A cobertura de guinchos nos dados abertos é irregular.
- Não há alertas certificados de radares, acidentes ou bloqueios.
- Use a navegação como apoio, respeite a sinalização e não interaja com o celular enquanto dirige.

## Teste
Abra o preview da branch aurora-connect-v03 na Vercel, ou sirva a pasta projeto/aurora-connect-v03 em um servidor estático com internet.
