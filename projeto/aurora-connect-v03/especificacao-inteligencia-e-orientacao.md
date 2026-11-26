# Aurora Connect V03 — especificação complementar de informação e orientação

Este documento amplia a estratégia aprovada sem substituir a navegação 3D, alterar a identidade visual ou afirmar integrações ainda não realizadas.

## 1. Cabeçalho permanente
- Manter o relógio com a data logo abaixo, no mesmo bloco visual já aprovado.
- Exibir dia da semana e data completa no formato brasileiro (ex.: quarta-feira · 25/11/2026).
- Usar o horário local do dispositivo/GPS, com fuso IANA `America/Bahia`; não fixar uma data de exemplo no produto.
- A data deve permanecer visível nos modos navegação, observação e orientação.

## 2. Dois modos de imagem, claramente identificados
### Imagem de câmera
- Só chamar de “ao vivo” quando houver stream autorizado, acessível e com atualização efetivamente verificada.
- Identificar via, sentido, ponto/campo de visão da câmera e horário da captura/último quadro.
- A imagem representa somente o campo de visão daquela câmera; não representa automaticamente todo o bairro ou toda a avenida.
- Se o stream cair ou envelhecer além do limite configurado, retirar o selo “Ao vivo” e mostrar “imagem indisponível” ou “última imagem recebida às HH:mm”.

### Representação 3D de orientação
- Usar em locais sem câmera disponível ou quando a imagem real não puder ser exibida.
- Identificar como “representação 3D — não é imagem ao vivo”.
- Não inventar veículos, acidentes, filas ou condições observadas. O cenário 3D é visualização de navegação; os estados de trânsito devem vir de fontes de dados separadas e identificadas.

## 3. Inteligência de trânsito
Cada observação/evento deve carregar, quando disponível:
- tipo de evento;
- via, bairro, coordenada/segmento e sentido;
- fonte e referência verificável;
- horário do fato, horário da publicação e horário da última checagem;
- estado: pista, em verificação, corroborado, confirmado por fonte competente, encerrado ou expirado;
- nível de confiança e justificativa;
- validade/expiração e próxima revalidação.

Não confundir confirmação de um evento (por exemplo, manifestação) com confirmação de impacto viário (fila, lentidão ou interdição). Não declarar via livre por ausência de dados.

## 4. Métricas de tráfego
- Contagem, velocidade média, extensão de fila e tempo de passagem só podem ser exibidos quando houver dados suficientes, método calibrado e timestamp.
- Para estimar extensão entre câmeras, exigir localização, orientação, cobertura e sincronização temporal conhecidas.
- Mostrar “estimativa” e faixa de incerteza quando aplicável; omitir a métrica quando não houver qualidade suficiente.
- Nunca inferir velocidade precisa a partir de uma única fotografia estática.

## 5. Rotas alternativas
- Comparar rota atual e alternativas legais usando dados atuais de tráfego, distância, tempo estimado e horário da atualização.
- Explicar a vantagem estimada (tempo e/ou distância) e a causa da recomendação.
- Só sugerir retorno, conversão ou mudança de via quando a manobra for permitida e a geometria/restrições da via estiverem confirmadas.
- Se a diferença for pequena ou os dados estiverem desatualizados, manter a rota e explicar a incerteza.

## 6. Alertas visuais, voz e radar
- Todo alerta importante deve ter texto/ícone além da voz, para funcionar quando o áudio estiver silenciado.
- Usar animação/pulsação discreta apenas para avisos relevantes; evitar pisca-pisca rápido ou estímulo que distraia.
- Radar: usar localização e limite provenientes de fonte confiável e atualizada; avisar com antecedência e orientar a respeitar o limite. Não afirmar velocidade medida do veículo sem integração/sensor confiável.
- O alerta deve desaparecer ou mudar de estado após o ponto, e não permanecer como se o radar ainda estivesse à frente.

## 7. Aurora Light Assist
- Calcular lembretes usando data, hora local, localização e condições meteorológicas disponíveis.
- Considerar pôr do sol/anoitecer, túneis, chuva, neblina e regras aplicáveis ao tipo de via e veículo.
- Diferenciar recomendação preventiva de obrigação legal.
- Não afirmar que o farol está apagado sem leitura confiável do veículo; emitir lembrete contextual.

## 8. Regras de voz
- Identificar via, sentido e trecho apenas quando a localização do veículo estiver suficientemente confiável.
- Dizer explicitamente se a informação vem de câmera, fonte oficial, dado de tráfego ou estimativa.
- Não anunciar “tempo real” sem atualização confirmada.
- Evitar mensagens repetidas; priorizar alertas urgentes e oferecer comparação de rotas quando houver benefício calculado.

## 9. Privacidade, autorização e estado atual
- Integrações de câmeras, GAT+, redes sociais, imprensa e APIs dependem de acesso técnico e autorização de uso.
- Minimizar retenção de imagens e dados pessoais; proteger placas e rostos conforme avaliação jurídica/técnica.
- Esta especificação é planejamento funcional. Não significa que câmeras, radares, GPS, clima, tráfego, voz ou rotas alternativas estejam integrados ou operacionais.
