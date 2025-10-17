// Configuração da API
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'http://localhost:3001/api'; // Em produção, usar URL real

// Estado global
let currentUser = null;
let chatHistory = [];

// Base de conhecimento
const CONHECIMENTO = {
    umidade_soja: {
        keywords: ['umidade', 'soja', 'armazenar', 'ideal', 'percentual'],
        resposta: `A <strong>umidade ideal para armazenamento de soja</strong> está entre <strong>11% e 13%</strong>. 

Valores acima desse limite aumentam significativamente os riscos de:
• Desenvolvimento de fungos e micotoxinas
• Aquecimento da massa de grãos
• Perda de germinação
• Redução do valor comercial

<strong>Recomendação:</strong> Realize a secagem imediatamente após a colheita e monitore regularmente a umidade durante o armazenamento.

<em>Fonte: Embrapa Soja</em>`
    },
    aeracao: {
        keywords: ['aeração', 'aeracao', 'ventilar', 'ar', 'temperatura'],
        resposta: `A <strong>aeração</strong> é fundamental para manter a qualidade dos grãos armazenados. Consiste na movimentação forçada de ar através da massa de grãos.

<strong>Objetivos principais:</strong>
• <strong>Resfriamento:</strong> Reduzir a temperatura da massa de grãos
• <strong>Uniformização:</strong> Eliminar gradientes de temperatura e umidade
• <strong>Prevenção:</strong> Evitar desenvolvimento de pragas e fungos

<strong>Quando aerear:</strong>
• Temperatura externa 5-10°C menor que a dos grãos
• Umidade relativa do ar abaixo de 70%
• Preferencialmente durante a noite ou madrugada

<strong>Vazão recomendada:</strong> 0,1 a 0,2 m³/min/t para soja e milho.

<em>Fonte: Embrapa</em>`
    },
    secagem: {
        keywords: ['secagem', 'secar', 'quebra', 'peso', 'calcular'],
        resposta: `A <strong>secagem</strong> é essencial para reduzir a umidade dos grãos a níveis seguros para armazenamento.

<strong>Cálculo de quebra de peso:</strong>
Peso Final = Peso Inicial × (100 - Umidade Inicial) / (100 - Umidade Final)

<strong>Exemplo prático:</strong>
• Peso Inicial: 10.000 kg
• Umidade Inicial: 18%
• Umidade Final: 13%
• Peso Final: 9.425 kg
• <strong>Quebra: 575 kg (5,75%)</strong>

<strong>Dica:</strong> Use nossa calculadora na aba "🧮 Calculadoras" para fazer seus próprios cálculos!

<em>Fonte: SENAR</em>`
    },
    gorgulho: {
        keywords: ['gorgulho', 'praga', 'inseto', 'besouro', 'sitophilus'],
        resposta: `O <strong>Gorgulho-do-milho</strong> (<em>Sitophilus zeamais</em>) é uma das pragas mais destrutivas de grãos armazenados.

<strong>Características:</strong>
• Pequeno besouro marrom-escuro (~3mm)
• Perfura os grãos para alimentação e oviposição
• Larvas se desenvolvem dentro dos grãos

<strong>Danos causados:</strong>
• Perda de peso
• Aquecimento da massa
• Redução da qualidade

<strong>Métodos de controle:</strong>
• Expurgo com fosfina (2-3 g/m³)
• Aeração preventiva
• Limpeza rigorosa das instalações
• Controle de temperatura abaixo de 15°C

<strong>Veja mais:</strong> Acesse a aba "🐛 Pragas" para detalhes completos!`
    },
    expurgo: {
        keywords: ['expurgo', 'fosfina', 'fumigação', 'pastilha', 'dosagem'],
        resposta: `O <strong>expurgo</strong> é um tratamento químico para controle de pragas em grãos armazenados, geralmente usando fosfina.

<strong>Dosagem recomendada:</strong>
• 2 a 3 g/m³ para a maioria dos grãos
• Tempo de exposição: 3 a 5 dias

<strong>Cálculo da quantidade:</strong>
1. Calcule o volume da estrutura (m³)
2. Multiplique pela dosagem (g/m³)
3. Divida pelo peso por pastilha (geralmente 3g)

<strong>Exemplo:</strong>
• Silo de 1.000 m³
• Dosagem: 2 g/m³
• Quantidade: (1.000 × 2) / 3 = 667 pastilhas

<strong>Use nossa calculadora!</strong> Vá para "🧮 Calculadoras" > "Calculadora de Expurgo"

<strong>⚠️ Importante:</strong> O expurgo deve ser realizado por profissionais qualificados seguindo todas as normas de segurança.`
    },
    qualidade: {
        keywords: ['qualidade', 'classificação', 'padrão', 'tipo', 'grão'],
        resposta: `A <strong>classificação de grãos</strong> no Brasil segue padrões estabelecidos pelo MAPA.

<strong>Soja - Tipos:</strong>

<strong>Tipo 1:</strong>
• Máx. 8% umidade
• Máx. 1% impurezas
• Máx. 8% grãos avariados
• Máx. 6% grãos quebrados

<strong>Tipo 2:</strong>
• Máx. 8% umidade
• Máx. 1,5% impurezas
• Máx. 10% grãos avariados
• Máx. 10% grãos quebrados

<strong>Importância:</strong>
A classificação determina o preço de comercialização, aceitação no mercado e os descontos aplicados.

<em>Fonte: CONAB</em>`
    },
    temperatura: {
        keywords: ['temperatura', 'calor', 'quente', 'frio', 'grau'],
        resposta: `O <strong>controle de temperatura</strong> é crucial para preservar a qualidade dos grãos armazenados.

<strong>Temperaturas recomendadas:</strong>
• <strong>Ideal:</strong> Abaixo de 15°C
• <strong>Aceitável:</strong> 15-20°C
• <strong>Risco:</strong> Acima de 20°C

<strong>Por que controlar:</strong>
• Temperaturas elevadas aceleram deterioração
• Favorecem desenvolvimento de fungos
• Aumentam atividade de insetos
• Reduzem poder germinativo

<strong>Como controlar:</strong>
• Aeração em horários adequados
• Monitoramento com termometria
• Isolamento térmico das estruturas
• Evitar entrada de ar quente

<strong>Dica:</strong> Realize termometria semanal para detectar pontos de aquecimento precocemente.`
    }
};

const DADOS = {
    pragas: [
        {
            id: 1,
            nome_popular: 'Gorgulho-do-milho',
            nome_cientifico: 'Sitophilus zeamais',
            descricao: 'Pequeno besouro de cor marrom-escura, com aproximadamente 3mm de comprimento. É uma das pragas mais destrutivas de grãos armazenados.',
            danos_causados: 'Perfura os grãos para alimentação e oviposição. As larvas se desenvolvem dentro dos grãos, causando perda de peso, aquecimento e redução da qualidade.',
            metodo_controle: 'Expurgo com fosfina (2-3 g/m³), aeração preventiva, limpeza rigorosa das instalações, controle de temperatura abaixo de 15°C.'
        },
        {
            id: 2,
            nome_popular: 'Traça-dos-cereais',
            nome_cientifico: 'Sitotroga cerealella',
            descricao: 'Pequena mariposa de cor palha, com 10-15mm de envergadura. As larvas são brancas e se desenvolvem dentro dos grãos.',
            danos_causados: 'As larvas consomem o interior dos grãos, deixando apenas a casca. Causam perda de peso e redução do poder germinativo.',
            metodo_controle: 'Expurgo com fosfina, uso de armadilhas com feromônio, controle de temperatura, limpeza e higienização das instalações.'
        },
        {
            id: 3,
            nome_popular: 'Caruncho-do-feijão',
            nome_cientifico: 'Acanthoscelides obtectus',
            descricao: 'Pequeno besouro de 2-3mm, cor marrom-acinzentada. Ataca principalmente leguminosas armazenadas.',
            danos_causados: 'Perfura os grãos para oviposição. As larvas se desenvolvem dentro, causando perda de peso e qualidade.',
            metodo_controle: 'Expurgo com fosfina, tratamento térmico, armazenamento em baixas temperaturas, uso de embalagens herméticas.'
        }
    ],
    cotacoes: [
        { grao: 'Soja', praca: 'Chicago', preco: 1250.50, variacao: 1.2 },
        { grao: 'Milho', praca: 'Chicago', preco: 580.30, variacao: -0.5 },
        { grao: 'Trigo', praca: 'Chicago', preco: 720.80, variacao: 0.8 }
    ]
};

// Inicialização
window.onload = function() {
    checkUser();
};

// Gerenciamento de Usuário
function checkUser() {
    const userData = localStorage.getItem('centralGraoUser');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        showApp();
    } else {
        showCadastro();
    }
}

function showCadastro() {
    document.getElementById('modalCadastro').classList.add('active');
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('modalCadastro').classList.remove('active');
    document.getElementById('appContainer').style.display = 'flex';
    
    // Atualizar informações do usuário no header
    const primeiroNome = currentUser.nome.split(' ')[0];
    document.getElementById('userInfo').textContent = `👤 ${primeiroNome}`;
    
    // Inicializar chat com saudação personalizada
    initChat();
}

// Cadastro de Usuário
document.getElementById('formCadastro').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        empresa: document.getElementById('empresa').value,
        funcao: document.getElementById('funcao').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value.toUpperCase(),
        cep: document.getElementById('cep').value,
        cnpj: document.getElementById('cnpj').value,
        cpf: document.getElementById('cpf').value
    };
    
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salvar dados localmente
            currentUser = { ...userData, id: data.usuario.id };
            localStorage.setItem('centralGraoUser', JSON.stringify(currentUser));
            
            // Mostrar aplicação
            showApp();
        } else {
            alert(data.error || 'Erro ao cadastrar usuário');
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        // Em caso de erro de rede, salvar localmente mesmo assim
        currentUser = userData;
        localStorage.setItem('centralGraoUser', JSON.stringify(currentUser));
        showApp();
    }
});

// Chat
function initChat() {
    const primeiroNome = currentUser.nome.split(' ')[0];
    const mensagemInicial = `Olá, <strong>${primeiroNome}</strong>! 👋 

Seja bem-vindo ao <strong>Central do Grão</strong>. Sou seu assistente especializado em armazenagem de grãos.

Posso ajudá-lo com informações sobre secagem, aeração, controle de pragas, qualidade e muito mais!

Como posso ajudá-lo hoje?`;
    
    addMessage(mensagemInicial, 'assistant');
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(section).classList.add('active');
    event.target.classList.add('active');

    if (section === 'pragas') {
        loadPragas();
    } else if (section === 'mercado') {
        loadCotacoes();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    chatHistory.push({ role: 'user', content: message });
    input.value = '';
    
    input.disabled = true;
    document.getElementById('sendBtn').disabled = true;
    
    showTypingIndicator();
    
    setTimeout(() => {
        const resposta = gerarResposta(message);
        removeTypingIndicator();
        addMessage(resposta, 'assistant');
        chatHistory.push({ role: 'assistant', content: resposta });
        
        input.disabled = false;
        document.getElementById('sendBtn').disabled = false;
        input.focus();
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function gerarResposta(pergunta) {
    const perguntaLower = pergunta.toLowerCase();
    
    let melhorMatch = null;
    let maxScore = 0;
    
    for (const [key, conteudo] of Object.entries(CONHECIMENTO)) {
        let score = 0;
        conteudo.keywords.forEach(keyword => {
            if (perguntaLower.includes(keyword)) {
                score++;
            }
        });
        
        if (score > maxScore) {
            maxScore = score;
            melhorMatch = conteudo;
        }
    }
    
    if (melhorMatch && maxScore > 0) {
        return melhorMatch.resposta;
    }
    
    if (perguntaLower.includes('olá') || perguntaLower.includes('oi') || perguntaLower.includes('bom dia')) {
        return 'Olá! 👋 Como posso ajudá-lo com informações sobre armazenagem de grãos hoje?';
    }
    
    if (perguntaLower.includes('obrigado') || perguntaLower.includes('obrigada')) {
        return 'Por nada! 😊 Estou aqui para ajudar. Se tiver mais dúvidas sobre armazenagem de grãos, é só perguntar!';
    }
    
    if (perguntaLower.includes('ajuda') || perguntaLower.includes('o que você faz')) {
        return `Sou um assistente especializado em <strong>armazenagem de grãos</strong>! Posso ajudá-lo com:

• <strong>Umidade e secagem</strong> de grãos
• <strong>Aeração</strong> e controle de temperatura
• <strong>Identificação e controle de pragas</strong>
• <strong>Expurgo</strong> e fumigação
• <strong>Qualidade e classificação</strong> de grãos
• <strong>Cálculos</strong> práticos (quebra, dosagem, etc.)

Faça uma pergunta ou use as sugestões acima!`;
    }
    
    return `Desculpe, não tenho informações específicas sobre isso no momento. 

Posso ajudá-lo com:
• Umidade ideal para armazenamento
• Aeração de grãos
• Controle de pragas
• Cálculos de secagem e expurgo
• Qualidade e classificação

Tente reformular sua pergunta ou escolha uma das sugestões acima! 😊`;
}

// Solicitação de Compras
async function enviarSolicitacao() {
    const mensagem = document.getElementById('mensagemCompra').value.trim();
    
    if (!mensagem) {
        showComprasResult('Por favor, descreva sua necessidade.', 'error');
        return;
    }
    
    const solicitacao = {
        usuario_id: currentUser.id,
        usuario_nome: currentUser.nome,
        usuario_email: currentUser.email,
        usuario_telefone: currentUser.telefone,
        usuario_empresa: currentUser.empresa,
        mensagem: mensagem
    };
    
    try {
        const response = await fetch(`${API_URL}/solicitacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitacao)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showComprasResult('✅ Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
            document.getElementById('mensagemCompra').value = '';
        } else {
            showComprasResult('❌ ' + (data.error || 'Erro ao enviar solicitação'), 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        showComprasResult('✅ Solicitação registrada! Entraremos em contato em breve.', 'success');
        document.getElementById('mensagemCompra').value = '';
    }
}

function showComprasResult(message, type) {
    const resultDiv = document.getElementById('comprasResult');
    resultDiv.className = type === 'success' ? 'success-message' : 'error-message';
    resultDiv.innerHTML = message;
    
    setTimeout(() => {
        resultDiv.innerHTML = '';
        resultDiv.className = '';
    }, 5000);
}

// Calculadoras
function toggleDimensoes() {
    const tipo = document.getElementById('tipoEstrutura').value;
    document.getElementById('dimensoesCilindro').style.display = tipo === 'cilindro' ? 'block' : 'none';
    document.getElementById('dimensoesRetangular').style.display = tipo === 'retangular' ? 'block' : 'none';
}

function calcularSecagem() {
    const pesoInicial = parseFloat(document.getElementById('pesoInicial').value);
    const umidadeInicial = parseFloat(document.getElementById('umidadeInicial').value);
    const umidadeFinal = parseFloat(document.getElementById('umidadeFinal').value);
    
    if (umidadeInicial <= umidadeFinal) {
        alert('A umidade inicial deve ser maior que a umidade final!');
        return;
    }
    
    const pesoFinal = pesoInicial * (100 - umidadeInicial) / (100 - umidadeFinal);
    const perdaPeso = pesoInicial - pesoFinal;
    const percentualQuebra = (perdaPeso / pesoInicial) * 100;
    
    document.getElementById('resultSecagem').innerHTML = `
        <div class="result">
            <h4>Resultado da Secagem</h4>
            <p><strong>Peso Final:</strong> ${pesoFinal.toFixed(2)} kg</p>
            <p><strong>Perda de Peso:</strong> ${perdaPeso.toFixed(2)} kg</p>
            <p><strong>Quebra:</strong> ${percentualQuebra.toFixed(2)}%</p>
        </div>
    `;
}

function calcularExpurgo() {
    const tipo = document.getElementById('tipoEstrutura').value;
    const dosagem = parseFloat(document.getElementById('dosagem').value);
    let volume;
    
    if (tipo === 'cilindro') {
        const diametro = parseFloat(document.getElementById('diametro').value);
        const altura = parseFloat(document.getElementById('altura').value);
        volume = Math.PI * Math.pow(diametro / 2, 2) * altura;
    } else {
        const comprimento = parseFloat(document.getElementById('comprimento').value);
        const largura = parseFloat(document.getElementById('largura').value);
        const altura = parseFloat(document.getElementById('alturaRet').value);
        volume = comprimento * largura * altura;
    }
    
    const pesoPorPastilha = 3;
    const quantidadePastilhas = Math.ceil((volume * dosagem) / pesoPorPastilha);
    const pesoTotal = (volume * dosagem) / 1000;
    
    document.getElementById('resultExpurgo').innerHTML = `
        <div class="result">
            <h4>Resultado do Expurgo</h4>
            <p><strong>Volume Total:</strong> ${volume.toFixed(2)} m³</p>
            <p><strong>Quantidade de Pastilhas:</strong> ${quantidadePastilhas} unidades</p>
            <p><strong>Peso Total do Produto:</strong> ${pesoTotal.toFixed(2)} kg</p>
        </div>
    `;
}

function calcularAeracao() {
    const diametro = parseFloat(document.getElementById('diametroAeracao').value);
    const altura = parseFloat(document.getElementById('alturaAeracao').value);
    const vazao = parseFloat(document.getElementById('vazao').value);
    
    const volumeGraos = Math.PI * Math.pow(diametro / 2, 2) * altura;
    const tempoRenovacao = volumeGraos / vazao;
    const tempoRecomendado = tempoRenovacao / 60;
    
    document.getElementById('resultAeracao').innerHTML = `
        <div class="result">
            <h4>Resultado da Aeração</h4>
            <p><strong>Volume de Grãos:</strong> ${volumeGraos.toFixed(2)} m³</p>
            <p><strong>Tempo para Renovar o Ar:</strong> ${tempoRenovacao.toFixed(2)} minutos</p>
            <p><strong>Tempo Recomendado de Aeração:</strong> ${tempoRecomendado.toFixed(2)} horas</p>
        </div>
    `;
}

// Pragas
function loadPragas() {
    const container = document.getElementById('pragasList');
    container.innerHTML = '';
    
    DADOS.pragas.forEach(praga => {
        container.innerHTML += `
            <div class="card praga-card" onclick="loadPragaDetail(${praga.id})">
                <div class="icon">🐛</div>
                <div class="praga-info">
                    <h3>${praga.nome_popular}</h3>
                    <p><em>${praga.nome_cientifico || ''}</em></p>
                </div>
            </div>
        `;
    });
    
    document.getElementById('pragaDetail').style.display = 'none';
}

function loadPragaDetail(pragaId) {
    const praga = DADOS.pragas.find(p => p.id === pragaId);
    const container = document.getElementById('pragaDetail');
    container.style.display = 'block';
    
    container.innerHTML = `
        <button class="back-btn" onclick="backToPragas()">← Voltar</button>
        <div class="article-detail">
            <h2>${praga.nome_popular}</h2>
            <p><em>${praga.nome_cientifico || ''}</em></p>
            <div style="width:100%;height:200px;background:#e0e0e0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:64px;margin:20px 0;">🐛</div>
            
            <h3>Descrição</h3>
            <p>${praga.descricao}</p>
            
            <h3>Danos Causados</h3>
            <p>${praga.danos_causados}</p>
            
            <h3>Métodos de Controle</h3>
            <p>${praga.metodo_controle}</p>
        </div>
    `;
    
    document.getElementById('pragasList').innerHTML = '';
}

function backToPragas() {
    document.getElementById('pragaDetail').style.display = 'none';
    loadPragas();
}

// Mercado
function loadCotacoes() {
    const container = document.getElementById('cotacoesList');
    container.innerHTML = '';
    
    DADOS.cotacoes.forEach(cot => {
        const variacaoClass = cot.variacao >= 0 ? 'positiva' : 'negativa';
        const variacaoSymbol = cot.variacao >= 0 ? '▲' : '▼';
        
        container.innerHTML += `
            <div class="cotacao-card">
                <h3>${cot.grao}</h3>
                <div class="preco">R$ ${cot.preco.toFixed(2)}</div>
                <div class="variacao ${variacaoClass}">
                    ${variacaoSymbol} ${Math.abs(cot.variacao).toFixed(2)}%
                </div>
                <p style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
                    ${cot.praca || 'Praça não informada'}
                </p>
            </div>
        `;
    });
}

