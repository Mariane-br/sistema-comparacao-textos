function calcularSimilaridades() {
    // Captura os textos digitados
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;

    // Verifica se os campos foram preenchidos
    if (!text1 || !text2) {
        document.getElementById('errorModal').style.display = 'block';
        return;
    }

    // Função para calcular Similaridade de Jaccard
    function jaccardIndex(str1, str2) {
        const set1 = new Set(str1.toLowerCase().split(/\s+/)); // Transforma texto em conjunto de palavras
        const set2 = new Set(str2.toLowerCase().split(/\s+/));
        const intersection = new Set([...set1].filter(x => set2.has(x))); // Palavras em comum
        const union = new Set([...set1, ...set2]); // Palavras totais
        return intersection.size / union.size;
    }

    // Função para calcular Similaridade do Cosseno
    function cosineSimilarity(str1, str2) {
        // Transforma texto em vetor de frequências (bag of words)
        const vectorize = str => {
            const words = str.toLowerCase().split(/\s+/);
            const vector = {};
            words.forEach(word => vector[word] = (vector[word] || 0) + 1);
            return vector;
        };

        const vec1 = vectorize(str1);
        const vec2 = vectorize(str2);
        const intersection = Object.keys(vec1).filter(word => vec2.hasOwnProperty(word));

        // Produto escalar
        const dotProduct = intersection.reduce((sum, word) => sum + vec1[word] * vec2[word], 0);

        // Cálculo da magnitude dos vetores
        const magnitude1 = Math.sqrt(Object.values(vec1).reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(Object.values(vec2).reduce((sum, val) => sum + val * val, 0));

        // Retorna a similaridade ou 0 se magnitudes forem 0
        if (magnitude1 && magnitude2) {
            return dotProduct / (magnitude1 * magnitude2);
        }
        return 0;
    }

    // Calcula ambas as métricas
    const jaccard = jaccardIndex(text1, text2);
    const cosine = cosineSimilarity(text1, text2);

    // Exibe os resultados formatados
    document.getElementById('cosineSimilarity').textContent = `Similaridade do Cosseno: ${(cosine * 100).toFixed(2)}%`;
    document.getElementById('jaccardSimilarity').textContent = `Similaridade de Jaccard: ${(jaccard * 100).toFixed(2)}%`;
    document.getElementById('result').style.display = 'block';
}

// Fecha o modal de erro
function fecharModal() {
    document.getElementById('errorModal').style.display = 'none';
}

// Limpa os campos e oculta os resultados
function limparCampos() {
    document.getElementById('text1').value = '';
    document.getElementById('text2').value = '';
    document.getElementById('cosineSimilarity').textContent = 'Similaridade do Cosseno: ';
    document.getElementById('jaccardSimilarity').textContent = 'Similaridade de Jaccard: ';
    document.getElementById('result').style.display = 'none';
}
