function calcularSimilaridades() {
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;

    if (!text1 || !text2) {
        // Exibe o modal de erro se algum dos campos estiver vazio
        document.getElementById('errorModal').style.display = 'block';
        return;
    }

    function jaccardIndex(str1, str2) {
        const set1 = new Set(str1.toLowerCase().split(/\s+/));
        const set2 = new Set(str2.toLowerCase().split(/\s+/));
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }

    function cosineSimilarity(str1, str2) {
        const vectorize = str => {
            const words = str.toLowerCase().split(/\s+/);
            const vector = {};
            words.forEach(word => vector[word] = (vector[word] || 0) + 1);
            return vector;
        };

        const vec1 = vectorize(str1);
        const vec2 = vectorize(str2);
        const intersection = Object.keys(vec1).filter(word => vec2.hasOwnProperty(word));

        const dotProduct = intersection.reduce((sum, word) => sum + vec1[word] * vec2[word], 0);
        const magnitude1 = Math.sqrt(Object.values(vec1).reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(Object.values(vec2).reduce((sum, val) => sum + val * val, 0));

        if (magnitude1 && magnitude2) {
            return dotProduct / (magnitude1 * magnitude2);
        }
        return 0;
    }

    const jaccard = jaccardIndex(text1, text2);
    const cosine = cosineSimilarity(text1, text2);

    document.getElementById('cosineSimilarity').textContent = `Similaridade do Cosseno: ${(cosine * 100).toFixed(2)}%`;
    document.getElementById('jaccardSimilarity').textContent = `Similaridade de Jaccard: ${(jaccard * 100).toFixed(2)}%`;
    document.getElementById('result').style.display = 'block';
}

function fecharModal() {
    document.getElementById('errorModal').style.display = 'none';
}

function limparCampos() {
    document.getElementById('text1').value = '';
    document.getElementById('text2').value = '';
    document.getElementById('cosineSimilarity').textContent = 'Similaridade do Cosseno: ';
    document.getElementById('jaccardSimilarity').textContent = 'Similaridade de Jaccard: ';
    document.getElementById('result').style.display = 'none';
}