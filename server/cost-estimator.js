/**
 * Cost Estimator for Video AI Processing
 * 
 * Run with: node cost-estimator.js [video_length_seconds]
 * Example: node cost-estimator.js 60
 */

const args = process.argv.slice(2);
const videoLengthsToTest = args.length > 0 ? args.map(a => parseInt(a, 10)) : [30, 60];


// --- PRICING DATA (Estimates per 1M input tokens) ---
// Note: Output tokens are ignored here because they are static (the JSON payload is small, ~200 tokens)
const PRICING = {
  gpt4o_mini: 0.15,        // $0.15 per 1M input tokens
  gpt4o: 5.00,             // $5.00 per 1M input tokens
  gemini_1_5_flash: 0.075, // $0.075 per 1M input tokens (<128k)
  gemini_1_5_pro: 3.50,    // $3.50 per 1M input tokens (<128k)
  gemini_2_5_flash: 0.30,  // $0.30 per 1M input tokens
};

// --- CONSTANTS ---
// OpenAI Images (Low Detail mode) = 85 tokens each
const OPENAI_LOW_RES_IMAGE_TOKENS = 85; 
// Gemini Video processing is roughly 264 tokens per second of video
const GEMINI_VIDEO_TOKENS_PER_SECOND = 264; 

const basePromptTokens = 500; // The system prompt instructing the model

function calculateCost(tokens, costPerMillion) {
  return (tokens / 1_000_000) * costPerMillion;
}

function formatCost(cost) {
  if (cost < 0.0001) return `< $0.0001`;
  return `$${cost.toFixed(5)}`;
}

function runEstimation(videoLengthSeconds) {
console.log(`\n======================================================`);
console.log(`💰 COST ESTIMATE FOR A ${videoLengthSeconds} SECOND VIDEO`);
console.log(`======================================================\n`);

// ==========================================
// SCENARIO 1: Full Video Upload (Gemini Native)
// ==========================================
const geminiVideoTokens = (videoLengthSeconds * GEMINI_VIDEO_TOKENS_PER_SECOND) + basePromptTokens;

console.log(`SCENARIO 1: Uploading Full Video (Native Video Understanding)`);
console.log(`Tokens used: ~${geminiVideoTokens.toLocaleString()}`);
console.log(`- Gemini 1.5 Flash : ${formatCost(calculateCost(geminiVideoTokens, PRICING.gemini_1_5_flash))}`);
console.log(`- Gemini 1.5 Pro   : ${formatCost(calculateCost(geminiVideoTokens, PRICING.gemini_1_5_pro))}`);
console.log(`- Gemini 2.5 Flash : ${formatCost(calculateCost(geminiVideoTokens, PRICING.gemini_2_5_flash))}\n`);


// ==========================================
// SCENARIO 2: Dense Frame Extraction (1 frame per second)
// ==========================================
const denseFrames = videoLengthSeconds; // 1 frame per second
const gpt4oDenseTokens = (denseFrames * OPENAI_LOW_RES_IMAGE_TOKENS) + basePromptTokens;

console.log(`SCENARIO 2: Dense Frame Extraction (1 frame per sec)`);
console.log(`Images sent: ${denseFrames}`);
console.log(`Tokens used: ~${gpt4oDenseTokens.toLocaleString()}`);
console.log(`- GPT-4o-Mini      : ${formatCost(calculateCost(gpt4oDenseTokens, PRICING.gpt4o_mini))}`);
console.log(`- GPT-4o           : ${formatCost(calculateCost(gpt4oDenseTokens, PRICING.gpt4o))}\n`);


// ==========================================
// SCENARIO 3: Sparse Keyframe Extraction (Hybrid approach: 3-5 frames total)
// ==========================================
const sparseFrames = 4; // Extract exactly 4 keyframes regardless of length
const gpt4oSparseTokens = (sparseFrames * OPENAI_LOW_RES_IMAGE_TOKENS) + basePromptTokens;

console.log(`SCENARIO 3: Sparse Keyframes (Hybrid approach: 4 frames total)`);
console.log(`Images sent: ${sparseFrames}`);
console.log(`Tokens used: ~${gpt4oSparseTokens.toLocaleString()} (Independent of video length)`);
console.log(`- GPT-4o-Mini      : ${formatCost(calculateCost(gpt4oSparseTokens, PRICING.gpt4o_mini))} (Recommended)`);
console.log(`- GPT-4o           : ${formatCost(calculateCost(gpt4oSparseTokens, PRICING.gpt4o))}`);
console.log(`======================================================\n`);

console.log(`💡 CONCLUSION:`);
console.log(`Processing 1,000 videos (${videoLengthSeconds}s each):`);
console.log(`- Gemini 1.5 Pro (Full Video)   : ~$${(calculateCost(geminiVideoTokens, PRICING.gemini_1_5_pro) * 1000).toFixed(2)}`);
console.log(`- Gemini 2.5 Flash (Full Video) : ~$${(calculateCost(geminiVideoTokens, PRICING.gemini_2_5_flash) * 1000).toFixed(2)}`);
console.log(`- GPT-4o-Mini (4 Keyframes)     : ~$${(calculateCost(gpt4oSparseTokens, PRICING.gpt4o_mini) * 1000).toFixed(2)}`);
console.log(`\nThe Hybrid Keyframe approach is significantly cheaper for production scaling.`);
}

videoLengthsToTest.forEach(runEstimation);
