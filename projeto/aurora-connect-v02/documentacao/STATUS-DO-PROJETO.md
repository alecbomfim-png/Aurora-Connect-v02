# Aurora Connect V2 — status técnico

Data da organização: 20/11/2026

## Aplicação disponível nesta versão
- Interface web responsiva em HTML, CSS e JavaScript.
- Mapa Leaflet com OpenStreetMap.
- Alternância para imagens de satélite Esri World Imagery.
- Busca de endereços via Nominatim, com fila para reduzir chamadas consecutivas.
- Rota de carro estimada via OSRM, com origem, destino, traçado, distância e duração estimada.
- Geolocalização do dispositivo, mediante permissão do usuário.
- Protótipo visual Road Sense 3D, explicitamente demonstrativo.
- Manifesto e service worker para instalação como PWA e cache básico da estrutura local.

## Limites que precisam permanecer claros
- As ocorrências de trânsito exibidas são exemplos demonstrativos, não são incidentes verificados nem tráfego em tempo real.
- OSRM calcula uma rota e duração estimada; não oferece, nesta integração, previsão de congestionamento em tempo real.
- A camada de satélite é imagem cartográfica, não vídeo ao vivo nem visão em tempo real de veículos.
- O protótipo Road Sense não detecta veículos, pedestres, buracos, radares ou colisões reais.
- O cache PWA não disponibiliza mapas, geocodificação ou cálculo de rotas integralmente offline.

## Próximas integrações necessárias
1. Fonte de tráfego em tempo real com licença e cobertura adequadas para a região.
2. Base validada de radares, limites de velocidade, obras e ocorrências, com data, fonte e confiança.
3. Fluxo de contribuição comunitária com moderação, expiração e prevenção de abuso.
4. Testes de instalação e navegação em iOS, Android e desktop.
5. Revisão de acessibilidade, desempenho, privacidade e segurança antes de uso público amplo.

## Instalação PWA
- iPhone/iPad: Safari → Compartilhar → Adicionar à Tela de Início.
- Android: navegador compatível → Instalar aplicativo / Adicionar à tela inicial.
- Desktop: usar a opção Instalar do navegador compatível.

O site precisa estar publicado em HTTPS. No iPhone, a instalação é feita pelo menu Compartilhar do Safari.

## Arquivos
- `index.html`: aplicação principal.
- `manifest.webmanifest`: metadados de instalação.
- `service-worker.js`: cache básico da aplicação.
- `icons/`: ícone da aplicação.
- `prototipo-road-sense-3d.html`: demonstração visual 3D.
- `laboratorio-testes-road-sense.html`: laboratório de testes demonstrativos.
- `anexos/`: pasta destinada a anexos e materiais complementares.
