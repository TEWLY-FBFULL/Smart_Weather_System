let embeddingModel = null;

async function loadEmbeddingModel() {
    if (!embeddingModel) {
        const { pipeline } = await import("@xenova/transformers");
        embeddingModel = await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2");
    }
    return embeddingModel;
}

async function getEmbedding(text) {
    try {
        const model = await loadEmbeddingModel();
        const output = await model(text, { pooling: "mean", normalize: true });
        return output.data;
    } catch (error) {
        console.error("Error in getEmbedding:", error);
        return new Float32Array(384);
    }
}

async function cosineSimilarity(vec1, vec2) {
    if (!vec1 || !vec2) {
        console.error("Error: One of the vectors is undefined or null.");
        return NaN;
    }

    if (vec1 instanceof Float32Array) vec1 = Array.from(vec1);
    if (vec2 instanceof Float32Array) vec2 = Array.from(vec2);

    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
        console.error("Invalid vectors for cosine similarity:", vec1, vec2);
        return NaN;
    }

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const normA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (normA === 0 || normB === 0 || isNaN(dotProduct)) {
        console.error("Zero vector detected, skipping similarity calculation.");
        return 0; 
    }
    return dotProduct / (normA * normB);
}

module.exports = { getEmbedding, cosineSimilarity };