# Aurora Connect V03 — preparação para integração de câmeras da Transalvador

## Objetivo
Preparar uma integração modular e autorizada com as imagens públicas de trânsito da Transalvador, começando pelo ponto da Avenida Luís Viana Filho (Paralela) e marginal de acesso à Avenida Luís Eduardo Magalhães, referência escolhida para o primeiro teste de observação pelo projeto.

## Situação confirmada
- A Transalvador oferece ao público uma página de consulta de imagens por meio do botão “Veja ao Vivo”.
- Informações públicas divulgadas em setembro/outubro de 2026 descrevem oito pontos de monitoramento, incluindo pontos da Paralela.
- A existência de consulta pública não comprova a existência de API, URL de stream incorporável, permissão para redistribuição, gravação, análise automatizada ou uso comercial.
- Até que haja autorização expressa e documentação técnica, o Aurora deve abrir o portal oficial como link externo e não copiar, capturar, incorporar, gravar ou retransmitir os quadros.

Portal de consulta: https://transalvador.salvador.ba.gov.br/

## Catálogo inicial de referência (não são endpoints)
1. Avenida Presidente Castelo Branco, ligação com a Avenida Mário Leal Ferreira (Bonocô).
2. Avenida Luís Viana Filho (Paralela) e parte da marginal de acesso à Avenida Luís Eduardo Magalhães.
3. Avenida Mário Leal Ferreira, sentido Acesso Norte, altura da Estação Bonocô.
4. Avenida Orlando Gomes e marginal de acesso à Rua da Gratidão, em Piatã.
5. Praça João Mangabeira, Barris.
6. Cruzamento da Avenida Jorge Amado com a Avenida Otávio Mangabeira, Boca do Rio.
7. Cruzamento da Rua Pernambuco com a Avenida Manoel Dias, Pituba.
8. Avenida Paralela, altura do Viaduto Eliana Kértesz.

Os nomes e descrições devem ser confirmados com a Transalvador antes de cadastrar coordenadas, sentidos ou identificadores técnicos definitivos.

## Contrato de integração futuro
A implementação deve usar um adaptador de provedor, sem URLs de câmera fixas no front-end:

- `provider`: identificador do provedor autorizado.
- `cameraId`: identificador oficial fornecido pelo provedor.
- `displayName`: nome legível do ponto.
- `road`, `direction`, `referencePoint`: via, sentido e referência confirmados.
- `location`: coordenadas oficiais ou validadas.
- `streamType`: tipo de integração documentado (por exemplo, HLS/WebRTC/endpoint oficial), somente após aprovação técnica.
- `authorizationStatus`: pending / approved / denied / expired.
- `streamStatus`: unavailable / connecting / live / stale / error.
- `capturedAt`: horário do quadro, se fornecido pelo provedor.
- `receivedAt`: horário de recebimento pelo Aurora.
- `lastVerifiedAt`: última verificação de saúde do fluxo.
- `termsVersion`: versão/registro das condições de uso autorizadas.

Não incluir segredo, token, URL privada ou credencial no código cliente ou repositório público. Credenciais futuras devem ficar em backend/secret manager.

## Regras de apresentação
- Exibir “Câmera Transalvador — ponto monitorado: [local]” somente com identificação confirmada.
- Usar o rótulo “AO VIVO” apenas quando o stream autorizado estiver conectado e a atualização dos quadros estiver dentro do limite de frescor definido.
- Se não houver timestamp ou sinal de vida confiável, não afirmar tempo real.
- Em falha ou atraso: “Imagem indisponível” ou “Última atualização às HH:mm”, quando esse horário for conhecido.
- A câmera representa apenas seu campo de visão. Não generalizar a imagem para toda a avenida ou bairro.
- Quando não houver câmera: mostrar a representação 3D identificada como “Representação 3D — não é imagem ao vivo”.
- Não preencher a cena com veículos, colisões ou filas fictícias apresentados como observação real.

## Pipeline de análise visual futuro
Somente após autorização específica para processamento:
1. Receber quadros no backend autorizado.
2. Validar timestamp, integridade, taxa de atualização e disponibilidade.
3. Aplicar processamento com minimização de dados e proteção de placas/rostos conforme avaliação jurídica e técnica.
4. Calibrar câmera, campo de visão e geometria viária antes de estimar distâncias ou velocidades.
5. Produzir métricas com confiança, método, intervalo temporal e estado de qualidade.
6. Correlacionar com outras câmeras, dados de tráfego e fontes independentes.
7. Expirar/revalidar eventos e impedir alertas baseados em quadros antigos.

Uma imagem estática não permite estimar velocidade média, extensão completa de fila, tempo de percurso nem confirmar colisão por si só. Essas métricas exigem sequência temporal, calibração e validação.

## Próximas ações externas necessárias
1. Solicitar à Transalvador/Prefeitura autorização formal para incorporação e, separadamente, para análise automatizada das imagens.
2. Solicitar documentação técnica: identificadores de câmera, protocolo/endpoints oficiais, timestamps, política de disponibilidade, limites de acesso e contato técnico.
3. Confirmar os pontos, coordenadas, orientação e sentidos de cada câmera.
4. Confirmar condições de uso, redistribuição, armazenamento, retenção, LGPD e eventuais custos.
5. Somente então implementar e testar o adaptador com credenciais no servidor.

## Estado atual
Esta documentação prepara a integração; não cria conexão com câmera, não obtém autorização, não fornece endpoint ou stream, e não ativa análise visual ou alertas em tempo real.
