// Lista simples de stopwords em português (palavras que serão ignoradas no cálculo)
const stopwords = new Set([
    'a', 'o', 'as', 'os', 'de', 'do', 'da', 'das', 'dos',
    'e', 'é', 'em', 'no', 'na', 'nas', 'nos', 'um', 'uma', 'uns', 'umas',
    'por', 'para', 'com', 'que', 'se', 'ao', 'à', 'às', 'está', 'estão',
    'foi', 'são', 'como', 'ou', 'mas', 'não', 'sim'
]);

// Mapa de sinônimos e variações para normalizar palavras
const mapaSinonimos = {
    computadores: 'maquinas',
    maquina: 'maquinas',
    maquinas: 'maquinas',
    trabalho: 'trabalho',
    produtividade: 'trabalho',
    facilitar: 'ajudar',
    aumentar: 'ajudar',
    transformar: 'mudar',
    mudando: 'mudar',
    transformado: 'mudar',
    rapidamente: 'aceleradamente',
    acelerada: 'aceleradamente'
    // Pode adicionar mais sinônimos aqui
};

// Substitui palavras pela forma normalizada segundo o mapa de sinônimos
function tratarSinonimosConjugacoes(palavras) {
    return palavras.map(p => mapaSinonimos[p] || p);
}

// Função para preprocessar o texto:
// - Converte para minúsculas
// - Remove acentuação
// - Remove pontuação
// - Divide em palavras
// - Remove stopwords
// - Substitui sinônimos/conjugacoes
function preprocess(text) {
    const palavras = text
        .toLowerCase() // tudo minúsculo
        .normalize('NFD') // decompor acentos
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[.,!?;:()"'”“‘’\-]/g, '') // remove pontuação
        .split(/\s+/) // separa por espaços
        .filter(word => word && !stopwords.has(word)); // remove stopwords e strings vazias

    return tratarSinonimosConjugacoes(palavras);
}

// Calcula Similaridade de Jaccard entre duas strings
function jaccardIndex(str1, str2) {
    const set1 = new Set(preprocess(str1));
    const set2 = new Set(preprocess(str2));

    if (set1.size === 0 && set2.size === 0) return 1; // textos vazios são considerados iguais

    // Interseção (palavras em comum)
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    // União (total de palavras distintas)
    const union = new Set([...set1, ...set2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
}

// Calcula Similaridade do Cosseno entre duas strings
function cosineSimilarity(str1, str2) {
    // Converte texto em vetor de frequências (bag of words)
    const vectorize = str => {
        const words = preprocess(str);
        const vector = {};
        words.forEach(word => vector[word] = (vector[word] || 0) + 1);
        return vector;
    };

    const vec1 = vectorize(str1);
    const vec2 = vectorize(str2);

    // Palavras que aparecem em ambos os vetores
    const intersection = Object.keys(vec1).filter(word => vec2.hasOwnProperty(word));

    // Produto escalar dos vetores
    const dotProduct = intersection.reduce((sum, word) => sum + vec1[word] * vec2[word], 0);

    // Magnitude dos vetores
    const magnitude1 = Math.sqrt(Object.values(vec1).reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(Object.values(vec2).reduce((sum, val) => sum + val * val, 0));

    // Retorna similaridade do cosseno, ou 0 se magnitudes forem zero
    return (magnitude1 && magnitude2) ? dotProduct / (magnitude1 * magnitude2) : 0;
}

// Função principal para calcular similaridades e mostrar resultado na interface
function calcularSimilaridades() {
    const text1 = document.getElementById('text1').value.trim();
    const text2 = document.getElementById('text2').value.trim();

    // Validação: se algum campo vazio, abre modal de erro
    if (!text1 || !text2) {
        abrirModalErro();
        return;
    }

    // Calcula métricas
    const jaccard = jaccardIndex(text1, text2);
    const cosine = cosineSimilarity(text1, text2);

    // Atualiza textos dos resultados na tela, formatando em porcentagem com 2 casas decimais
    document.getElementById('cosineSimilarity').textContent = `Similaridade do Cosseno: ${(cosine * 100).toFixed(2)}%`;
    document.getElementById('jaccardSimilarity').textContent = `Similaridade de Jaccard: ${(jaccard * 100).toFixed(2)}%`;

    // Exibe a área de resultados (que estava oculta)
    document.getElementById('result').style.display = 'block';
}

// Função para abrir o modal de erro
function abrirModalErro() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'flex'; // exibe o modal
    modal.setAttribute('aria-hidden', 'false'); // acessibilidade
}

// Função para fechar o modal de erro
function fecharModalErro() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none'; // esconde o modal
    modal.setAttribute('aria-hidden', 'true'); // acessibilidade
}

// Limpa os campos de texto e esconde os resultados
function limparCampos() {
    document.getElementById('text1').value = '';
    document.getElementById('text2').value = '';
    document.getElementById('cosineSimilarity').textContent = 'Similaridade do Cosseno: ';
    document.getElementById('jaccardSimilarity').textContent = 'Similaridade de Jaccard: ';
    document.getElementById('result').style.display = 'none';
}

// Após o carregamento do DOM, adiciona listeners aos botões e modal
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCalcular').addEventListener('click', calcularSimilaridades);
    document.getElementById('btnLimpar').addEventListener('click', limparCampos);

    const btnClose = document.querySelector('.close-btn');
    btnClose.addEventListener('click', fecharModalErro);

    // Fechar modal se clicar fora do conteúdo
    document.getElementById('errorModal').addEventListener('click', e => {
        if (e.target.id === 'errorModal') {
            fecharModalErro();
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.getElementById('errorModal').style.display === 'flex') {
            fecharModalErro();
        }
    });
});
