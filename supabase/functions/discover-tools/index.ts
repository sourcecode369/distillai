import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ---- CONFIG -----------------------------------------------------------------

const GITHUB_API_BASE = "https://api.github.com";
const MIN_STARS_GLOBAL = 30; // lowered from 50 for broader coverage
const SUPABASE_UPSERT_BATCH_SIZE = 200;

const BASE_FILTERS = "is:public archived:false in:name,description,readme";

// CRITICAL: Whitelist for major frameworks/libraries that MUST be included
const MUST_INCLUDE_REPOS = [
  // --- Your MUST INCLUDE repos ---
  "tensorflow/tensorflow",
  "pytorch/pytorch",
  "scikit-learn/scikit-learn",
  "keras-team/keras",
  "huggingface/transformers",
  "openai/openai-python",
  "langchain-ai/langchain",
  "run-llama/llama_index",
  "ggerganov/llama.cpp",
  "unslothai/unsloth",
  "vllm-project/vllm",
  "mlc-ai/mlc-llm",
  "Lightning-AI/pytorch-lightning",
  "ray-project/ray",
  "gradio-app/gradio",
  "streamlit/streamlit",
  "anthropics/anthropic-sdk-python",
  "mistralai/mistral-inference",

  // --- Core Scientific Computing ---
  "numpy/numpy",
  "scipy/scipy",
  "pandas-dev/pandas",
  "pola-rs/polars",
  "vaexio/vaex",
  "dask/dask",
  "apache/arrow",
  "cupy/cupy",
  "rapidsai/cudf",
  "rapidsai/cuml",

  // --- Visualization ---
  "matplotlib/matplotlib",
  "mwaskom/seaborn",
  "plotly/plotly.py",
  "bokeh/bokeh",
  "altair-viz/altair",
  "holoviz/holoviews",
  "DistrictDataLabs/yellowbrick",
  "ydataai/ydata-profiling",
  "facebookresearch/sweetviz",
  "ResidentMario/missingno",

  // --- Traditional ML ---
  "scikit-learn/scikit-learn",
  "dmlc/xgboost",
  "microsoft/LightGBM",
  "catboost/catboost",
  "statsmodels/statsmodels",
  "pycaret/pycaret",
  "rasbt/mlxtend",
  "scikit-learn-contrib/imbalanced-learn",
  "h2oai/h2o-3",
  "apache/spark",

  // --- Deep Learning ---
  "tensorflow/tensorflow",
  "keras-team/keras",
  "pytorch/pytorch",
  "google/jax",
  "google/flax",
  "apache/mxnet",
  "PaddlePaddle/Paddle",
  "deeplearning4j/deeplearning4j",
  "chainer/chainer",
  "fastai/fastai",

  // --- Transformers & LLM Infra ---
  "huggingface/transformers",
  "huggingface/accelerate",
  "sentence-transformers/sentence-transformers",
  "openai/triton",
  "vllm-project/vllm",
  "microsoft/DeepSpeed",
  "NVIDIA/Megatron-LM",
  "hpcaitech/colossal-ai",
  "huggingface/peft",
  "Dao-AILab/flash-attention",

  // --- NLP ---
  "explosion/spaCy",
  "nltk/nltk",
  "RaRe-Technologies/gensim",
  "stanfordnlp/stanza",
  "flairNLP/flair",
  "sloria/TextBlob",
  "OpenNMT/OpenNMT-py",
  "facebookresearch/fastText",
  "aboSamoor/polyglot",
  "mjpost/sacrebleu",

  // --- Computer Vision ---
  "opencv/opencv",
  "python-pillow/Pillow",
  "kornia/kornia",
  "facebookresearch/detectron2",
  "open-mmlab/mmdetection",
  "open-mmlab/mmdetection3d",
  "open-mmlab/mmsegmentation",
  "albumentations-team/albumentations",
  "Deci-AI/super-gradients",
  "huggingface/pytorch-image-models",

  // --- Time Series ---
  "facebook/prophet",
  "unit8co/darts",
  "awslabs/gluon-ts",
  "facebookresearch/Kats",
  "alan-turing-institute/sktime",
  "uber/orbit",
  "salesforce/Merlion",
  "neuralprophet/neural_prophet",
  "blue-yonder/tsfresh",
  "nixtla/statsforecast",

  // --- Reinforcement Learning ---
  "DLR-RM/stable-baselines3",
  "ray-project/ray",
  "thu-ml/tianshou",
  "vwxyzjn/cleanrl",
  "NervanaSystems/coach",
  "google/dopamine",
  "deepmind/acme",
  "Farama-Foundation/PettingZoo",
  "instadeepai/Mava",
  "vitchyr/rlpyt",

  // --- Interpretability / XAI ---
  "slundberg/shap",
  "marcotcr/lime",
  "pytorch/captum",
  "TeamHG-Memex/eli5",
  "salesforce/OmniXAI",
  "SeldonIO/alibi",
  "interpretml/interpret",
  "IBM/AIX360",
  "fairlearn/fairlearn",
  "PAIR-code/what-if-tool",

  // --- MLOps / Monitoring / Serving ---
  "mlflow/mlflow",
  "wandb/wandb",
  "neptune-ai/neptune-client",
  "aimhubio/aim",
  "IDSIA/sacred",
  "guildai/guildai",
  "tensorflow/tensorboard",
  "bentoml/bentoml",
  "ray-project/ray",
  "kserve/kserve",
  "SeldonIO/seldon-core",
  "triton-inference-server/server",
  "openvinotoolkit/model_server",
  "evidentlyai/evidently",
  "whylabs/whylogs",
  "arize-ai/phoenix",
  "deepchecks/deepchecks",
  "truera/truera-python",
  "AporiaAI/Aporia",
  "superwise-care/superwise-client",

  // --- Data Versioning / Lineage ---
  "iterative/dvc",
  "delta-io/delta",
  "apache/iceberg",
  "treeverse/lakefs",
  "pachyderm/pachyderm",
  "OpenLineage/OpenLineage",

  // --- Orchestration / Pipelines ---
  "dagster-io/dagster",
  "apache/airflow",
  "PrefectHQ/prefect",
  "kubeflow/pipelines",
  "Netflix/metaflow",
  "flyteorg/flyte",
  "argoproj/argo-workflows",

  // --- Data Quality / Testing ---
  "great-expectations/great_expectations",
  "deepchecks/deepchecks",
  "bridgecrewio/checkov"
];


// Expanded AI domains + INTERPRETABILITY + Prompt Engineering + More
const SEARCH_QUERIES: string[] = [
  // ===== Core ML / DL / NN =====
  `${BASE_FILTERS} topic:machine-learning stars:>100`,
  `${BASE_FILTERS} topic:deep-learning stars:>100`,
  `${BASE_FILTERS} topic:neural-network stars:>100`,
  `${BASE_FILTERS} topic:artificial-intelligence stars:>100`,
  `${BASE_FILTERS} "machine learning" language:Python stars:>100`,
  `${BASE_FILTERS} "deep learning" language:Python stars:>100`,
  `${BASE_FILTERS} "neural network" language:Python stars:>100`,
  `${BASE_FILTERS} "ai framework" stars:>80`,
  `${BASE_FILTERS} "ml framework" stars:>80`,

  // ===== LLM / Generative AI =====
  `${BASE_FILTERS} topic:generative-ai stars:>150`,
  `${BASE_FILTERS} topic:llm stars:>120`,
  `${BASE_FILTERS} "LLM" stars:>120`,
  `${BASE_FILTERS} "large language model" stars:>120`,
  `${BASE_FILTERS} "foundation model" stars:>100`,
  `${BASE_FILTERS} "inference server" stars:>80`,
  `${BASE_FILTERS} "inference engine" stars:>80`,
  `${BASE_FILTERS} "inference runtime" stars:>80`,
  `${BASE_FILTERS} "llm inference" stars:>80`,
  `${BASE_FILTERS} "model inference" stars:>60`,

  // ===== Diffusion / Image Gen / Vision-Language =====
  `${BASE_FILTERS} "diffusion model" stars:>80`,
  `${BASE_FILTERS} "stable diffusion" stars:>80`,
  `${BASE_FILTERS} "image generation" stars:>80`,
  `${BASE_FILTERS} "vision language" stars:>80`,
  `${BASE_FILTERS} "image-to-image" stars:>60`,
  `${BASE_FILTERS} "text-to-image" stars:>60`,
  `${BASE_FILTERS} "multimodal" stars:>50`,
  `${BASE_FILTERS} "vision-language model" stars:>40`,

  // ===== RAG / Retrieval / Vector Search =====
  `${BASE_FILTERS} topic:rag stars:>80`,
  `${BASE_FILTERS} "retrieval augmented generation" stars:>80`,
  `${BASE_FILTERS} "retrieval-augmented generation" stars:>80`,
  `${BASE_FILTERS} "vector database" stars:>40`,
  `${BASE_FILTERS} "vector search" stars:>40`,
  `${BASE_FILTERS} "vector store" stars:>40`,
  `${BASE_FILTERS} "embedding store" stars:>40`,
  `${BASE_FILTERS} "semantic search" stars:>40`,
  `${BASE_FILTERS} "information retrieval" stars:>50`,
  `${BASE_FILTERS} "embeddings" stars:>60`,

  // ===== Agents / Tools / Routing =====
  `${BASE_FILTERS} "ai agent" stars:>40`,
  `${BASE_FILTERS} "agent framework" stars:>40`,
  `${BASE_FILTERS} "agentic workflow" stars:>40`,
  `${BASE_FILTERS} "tool calling" stars:>40`,
  `${BASE_FILTERS} "function calling" stars:>40`,
  `${BASE_FILTERS} "autonomous agent" stars:>40`,
  `${BASE_FILTERS} topic:ai-agent stars:>30`,

  // ===== LangChain / LlamaIndex / tool ecosystems =====
  `${BASE_FILTERS} langchain in:name stars:>80`,
  `${BASE_FILTERS} "langchain" "toolkit" stars:>80`,
  `${BASE_FILTERS} "llamaindex" stars:>80`,
  `${BASE_FILTERS} "semantic kernel" stars:>80`,
  `${BASE_FILTERS} "haystack" stars:>60`,

  // ===== Transformers / Tokenizers / Embeddings =====
  `${BASE_FILTERS} transformers in:name stars:>200`,
  `${BASE_FILTERS} "transformer model" stars:>100`,
  `${BASE_FILTERS} "tokenizer" stars:>50`,
  `${BASE_FILTERS} "byte pair encoding" stars:>50`,
  `${BASE_FILTERS} "sentence embedding" stars:>40`,
  `${BASE_FILTERS} "text embedding" stars:>40`,

  // ===== CV =====
  `${BASE_FILTERS} topic:computer-vision stars:>200`,
  `${BASE_FILTERS} "computer vision" language:Python stars:>200`,
  `${BASE_FILTERS} "object detection" stars:>120`,
  `${BASE_FILTERS} "image segmentation" stars:>100`,
  `${BASE_FILTERS} "pose estimation" stars:>80`,
  `${BASE_FILTERS} "ocr" stars:>60`,
  `${BASE_FILTERS} "face recognition" stars:>60`,

  // ===== NLP =====
  `${BASE_FILTERS} topic:nlp stars:>200`,
  `${BASE_FILTERS} "natural language processing" stars:>200`,
  `${BASE_FILTERS} "text classification" stars:>60`,
  `${BASE_FILTERS} "text summarization" stars:>60`,
  `${BASE_FILTERS} "named entity recognition" stars:>60`,
  `${BASE_FILTERS} "sentiment analysis" stars:>60`,

  // ===== Speech / Audio =====
  `${BASE_FILTERS} "speech recognition" stars:>80`,
  `${BASE_FILTERS} "speech-to-text" stars:>80`,
  `${BASE_FILTERS} "text-to-speech" stars:>80`,
  `${BASE_FILTERS} "speech synthesis" stars:>80`,
  `${BASE_FILTERS} topic:audio stars:>80`,
  `${BASE_FILTERS} "audio processing" stars:>50`,
  `${BASE_FILTERS} "voice cloning" stars:>60`,
  `${BASE_FILTERS} "audio-visual" stars:>30`,

  // ===== Reinforcement Learning =====
  `${BASE_FILTERS} "reinforcement learning" stars:>80`,
  `${BASE_FILTERS} topic:reinforcement-learning stars:>80`,
  `${BASE_FILTERS} "multi-agent reinforcement learning" stars:>50`,
  `${BASE_FILTERS} "rl environment" stars:>40`,
  `${BASE_FILTERS} "robotics rl" stars:>40`,

  // ===== Robotics / Control =====
  `${BASE_FILTERS} topic:robotics stars:>100`,
  `${BASE_FILTERS} "motion planning" stars:>40`,
  `${BASE_FILTERS} "control systems" stars:>40`,

  // ===== Time Series / Forecasting =====
  `${BASE_FILTERS} "time series" stars:>60`,
  `${BASE_FILTERS} "forecasting" stars:>60`,
  `${BASE_FILTERS} "temporal modeling" stars:>40`,
  `${BASE_FILTERS} "anomaly detection" stars:>60`,

  // ===== Recommendation Systems =====
  `${BASE_FILTERS} "recommender system" stars:>60`,
  `${BASE_FILTERS} "recommendation engine" stars:>40`,

  // ===== Graph ML (GNNs) =====
  `${BASE_FILTERS} topic:graph stars:>60`,
  `${BASE_FILTERS} "graph neural network" stars:>60`,
  `${BASE_FILTERS} "gnn" stars:>40`,

  // ===== Synthetic Data / Data Generation =====
  `${BASE_FILTERS} "synthetic data" stars:>60`,
  `${BASE_FILTERS} "data augmentation" stars:>40`,
  `${BASE_FILTERS} "data generation" stars:>40`,
  `${BASE_FILTERS} "simulation" "ai" stars:>40`,

  // ===== Federated Learning =====
  `${BASE_FILTERS} topic:federated-learning stars:>40`,
  `${BASE_FILTERS} "federated learning" stars:>40`,

  // ===== AutoML =====
  `${BASE_FILTERS} "auto ml" stars:>60`,
  `${BASE_FILTERS} automl stars:>60`,
  `${BASE_FILTERS} "model search" stars:>40`,
  `${BASE_FILTERS} "neural architecture search" stars:>40`,

  // ===== Bayesian ML =====
  `${BASE_FILTERS} "bayesian" stars:>60`,
  `${BASE_FILTERS} "probabilistic programming" stars:>40`,
  `${BASE_FILTERS} pyro-ai stars:>20`,

  // ===== Optimization / Training Efficiency =====
  `${BASE_FILTERS} "model compression" stars:>60`,
  `${BASE_FILTERS} quantization stars:>40`,
  `${BASE_FILTERS} pruning stars:>40`,
  `${BASE_FILTERS} distillation stars:>40`,
  `${BASE_FILTERS} "efficient training" stars:>40`,
  `${BASE_FILTERS} "mixed precision" stars:>30`,

  // ===== MLOps / CI/CD / Monitoring =====
  `${BASE_FILTERS} "mlops" stars:>80`,
  `${BASE_FILTERS} "model monitoring" stars:>50`,
  `${BASE_FILTERS} "data pipeline" stars:>50`,
  `${BASE_FILTERS} "experiment tracking" stars:>40`,
  `${BASE_FILTERS} "feature store" stars:>40`,
  `${BASE_FILTERS} "data validation" stars:>40`,
  `${BASE_FILTERS} "mlflow" stars:>40`,
  `${BASE_FILTERS} "model registry" stars:>30`,

  // ===== Knowledge Graphs =====
  `${BASE_FILTERS} "knowledge graph" stars:>40`,
  `${BASE_FILTERS} "graph database" stars:>40`,

  // ===== Interpretability / Explainability / XAI =====
  `${BASE_FILTERS} "model interpretability" stars:>40`,
  `${BASE_FILTERS} "model explainability" stars:>40`,
  `${BASE_FILTERS} "explainable ai" stars:>40`,
  `${BASE_FILTERS} topic:interpretability stars:>20`,
  `${BASE_FILTERS} topic:explainable-ai stars:>20`,
  `${BASE_FILTERS} shap "feature attribution" stars:>30`,
  `${BASE_FILTERS} "lime" "explainability" stars:>20`,
  `${BASE_FILTERS} "saliency map" stars:>20`,
  `${BASE_FILTERS} "feature importance" "explain" stars:>20`,
  `${BASE_FILTERS} "xai" stars:>30`,

  // ===== Prompt Engineering / Optimization =====
  `${BASE_FILTERS} "prompt engineering" stars:>40`,
  `${BASE_FILTERS} "prompt optimization" stars:>30`,
  `${BASE_FILTERS} topic:prompt-engineering stars:>30`,
  `${BASE_FILTERS} "prompt template" stars:>30`,
  `${BASE_FILTERS} "prompt management" stars:>25`,

  // ===== Fine-tuning / Training Tools =====
  `${BASE_FILTERS} "fine-tuning" stars:>50`,
  `${BASE_FILTERS} "model training" stars:>50`,
  `${BASE_FILTERS} "transfer learning" stars:>40`,
  `${BASE_FILTERS} "peft" stars:>30`,
  `${BASE_FILTERS} "lora" stars:>30`,
  `${BASE_FILTERS} "qlora" stars:>25`,
  `${BASE_FILTERS} "parameter efficient" stars:>30`,
  `${BASE_FILTERS} unsloth in:name stars:>20`,
  `${BASE_FILTERS} "unsloth" stars:>20`,

  // ===== Model Serving / Deployment =====
  `${BASE_FILTERS} "model serving" stars:>40`,
  `${BASE_FILTERS} "model deployment" stars:>40`,
  `${BASE_FILTERS} triton in:name stars:>30`,
  `${BASE_FILTERS} "onnx runtime" stars:>30`,
  `${BASE_FILTERS} "model optimization" stars:>40`,

  // ===== Data Processing / Preprocessing =====
  `${BASE_FILTERS} "data preprocessing" machine-learning stars:>40`,
  `${BASE_FILTERS} "feature engineering" stars:>40`,
  `${BASE_FILTERS} "data labeling" stars:>40`,
  `${BASE_FILTERS} "annotation tool" stars:>30`,
  `${BASE_FILTERS} "data cleaning" machine-learning stars:>30`,

  // ===== API Frameworks / Clients =====
  `${BASE_FILTERS} "openai api" stars:>40`,
  `${BASE_FILTERS} "anthropic api" stars:>30`,
  `${BASE_FILTERS} "huggingface api" stars:>30`,
  `${BASE_FILTERS} "api wrapper" ai stars:>30`,
  `${BASE_FILTERS} "api client" llm stars:>30`,

  // ===== Evaluation / Testing =====
  `${BASE_FILTERS} "model evaluation" stars:>40`,
  `${BASE_FILTERS} "llm evaluation" stars:>30`,
  `${BASE_FILTERS} "ai testing" stars:>30`,
  `${BASE_FILTERS} "benchmark" "llm" stars:>40`,

  // ===== UI / Interfaces =====
  `${BASE_FILTERS} "gradio" stars:>50`,
  `${BASE_FILTERS} "streamlit" ai stars:>50`,
  `${BASE_FILTERS} "chat interface" stars:>30`,
  `${BASE_FILTERS} "web ui" llm stars:>30`,

  // ===== Language-Specific Searches =====
  `${BASE_FILTERS} language:Python "ai" stars:>200`,
  `${BASE_FILTERS} language:Python "ml" stars:>200`,
  `${BASE_FILTERS} language:Rust "llm" stars:>50`,
  `${BASE_FILTERS} language:TypeScript "ai" stars:>100`,
  `${BASE_FILTERS} language:Go "machine learning" stars:>80`,

  // ===== Time-Based Searches for Newer Tools =====
  `${BASE_FILTERS} "llm" created:>2023-01-01 stars:>30`,
  `${BASE_FILTERS} "rag" created:>2023-01-01 stars:>25`,
  `${BASE_FILTERS} "ai agent" created:>2023-06-01 stars:>20`,
  `${BASE_FILTERS} "generative ai" created:>2023-01-01 stars:>30`,

  // ===== Specific High-Value Tools (by name) =====
  `${BASE_FILTERS} axolotl in:name stars:>20`,
  `${BASE_FILTERS} vllm in:name stars:>20`,
  `${BASE_FILTERS} llama.cpp in:name stars:>20`,
  `${BASE_FILTERS} ollama in:name stars:>20`,
  `${BASE_FILTERS} autogen in:name stars:>20`,
  `${BASE_FILTERS} crewai in:name stars:>20`,

  // ===== Major Frameworks (ensure these are caught) =====
  `${BASE_FILTERS} tensorflow repo:tensorflow/tensorflow`,
  `${BASE_FILTERS} pytorch repo:pytorch/pytorch`,
  `${BASE_FILTERS} scikit-learn repo:scikit-learn/scikit-learn`,
  `${BASE_FILTERS} keras repo:keras-team/keras`,
  `${BASE_FILTERS} transformers repo:huggingface/transformers`,

  // ===== Application-Specific Tools =====
  `${BASE_FILTERS} "chatbot" stars:>40`,
  `${BASE_FILTERS} "document qa" stars:>30`,
  `${BASE_FILTERS} "pdf parser" ai stars:>30`,
  `${BASE_FILTERS} "voice assistant" stars:>30`,
  `${BASE_FILTERS} "ai api" stars:>30`,
  `${BASE_FILTERS} "model zoo" stars:>30`,
];


// Expanded important orgs
const AI_ORGS = [
  "huggingface",
  "langchain-ai",
  "openai",
  "pytorch",
  "tensorflow",
  "scikit-learn",
  "keras-team",
  "ray-project",
  "Lightning-AI",
  "mlc-ai",
  "vllm-project",
  "qdrant",
  "milvus-io",
  "chroma-core",
  "llamaindex",
  "run-llama",
  "mistralai",
  "meta-llama",
  "anthropics",
  "google-research",
  "facebookresearch",
  "microsoft",
  "nvidia",
  "aws",
  "apple",
  "stability-ai",
  "stabilityai",
  "cohere-ai",
  "deepmind",
  "unslothai",
  "axolotl-ai-cloud",
  "BerriAI",
  "modal-labs",
  "replicate",
  "gradio-app",
  "streamlit",
  "wandb",
  "mlflow",
  "bentoml",
  "ggerganov",
  "nomic-ai",
  "pinecone-io",
  "weaviate",
];

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  language?: string | null;
};

type AiTool = {
  name: string;
  category: string;
  short_description: string;
  github_url: string;
  github_stars: string;
  official_docs_url: string;
};

// ---- HELPERS ----------------------------------------------------------------

function normalizeTopics(repo: GitHubRepo): string[] {
  if (!Array.isArray(repo.topics)) return [];
  return repo.topics.map((t) => (t || "").toLowerCase());
}

function textIncludes(text: string | null | undefined, needle: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(needle.toLowerCase());
}

function anyIncludes(haystack: string[], ...needles: string[]): boolean {
  const joined = haystack.join(" ").toLowerCase();
  return needles.some((n) => joined.includes(n.toLowerCase()));
}

function formatStars(stars: number): string {
  // if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return stars.toString();
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Enhanced tool detection
function isLikelyAITool(repo: GitHubRepo): boolean {
  const name = (repo.name || "").toLowerCase();
  const fullName = (repo.full_name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = normalizeTopics(repo);
  const topicsJoined = topics.join(" ");

  // CRITICAL: Check whitelist FIRST - these MUST be included regardless of other criteria
  const isWhitelisted = MUST_INCLUDE_REPOS.some(
    (r) => r.toLowerCase() === fullName,
  );
  if (isWhitelisted) {
    console.log(`✓ Whitelist match: ${fullName}`);
    return true;
  }

  // NOW apply the standard filters for non-whitelisted repos
  if (repo.archived) return false;
  if (repo.fork) return false;
  if ((repo.stargazers_count ?? 0) < MIN_STARS_GLOBAL) return false;

  // --- Strong negative signals: lists, courses, learning content ------------
  const isListOrCourse =
    name.includes("awesome") ||
    name.includes("awesome-") ||
    name.includes("list") ||
    name.includes("resources") ||
    name.includes("course") ||
    name.includes("tutorial") ||
    name.includes("interview") ||
    name.includes("roadmap") ||
    name.includes("cheatsheet") ||
    name.includes("notes") ||
    name.includes("handbook") ||
    name.includes("guide") ||
    name.includes("syllabus") ||
    name.includes("university") ||
    name.includes("learning-path") ||
    desc.includes("curated list") ||
    desc.includes("awesome list") ||
    desc.includes("learning path") ||
    desc.includes("collection of") ||
    topicsJoined.includes("awesome") ||
    topicsJoined.includes("awesome-list") ||
    topicsJoined.includes("book") ||
    topicsJoined.includes("course") ||
    topicsJoined.includes("tutorial") ||
    topicsJoined.includes("learning") ||
    topicsJoined.includes("education");

  if (isListOrCourse) return false;

  // --- Papers, benchmarks, leaderboards -------------------------------------
  const isPaperOrBenchmark =
    name.includes("paper") ||
    name.includes("papers-with-code") ||
    name.includes("survey") ||
    desc.includes("arxiv") ||
    desc.includes("arxiv.org") ||
    desc.includes("research paper") ||
    desc.includes("collection of papers") ||
    topicsJoined.includes("paper") ||
    topicsJoined.includes("research");

  if (isPaperOrBenchmark) return false;

  // --- Examples / demos / playgrounds / templates ---------------------------
  const isExampleOrDemo =
    name.includes("examples") ||
    name.includes("example") ||
    name.includes("demo") ||
    name.includes("sample") ||
    name.includes("playground") ||
    name.includes("template") ||
    name.includes("boilerplate") ||
    fullName.endsWith("/examples") ||
    topicsJoined.includes("examples") ||
    topicsJoined.includes("demo") ||
    topicsJoined.includes("playground") ||
    topicsJoined.includes("boilerplate");

  if (isExampleOrDemo) return false;

  // --- Enhanced positive signals ---------------------------------------------
  const hasStrongLibrarySignals =
    topicsJoined.includes("library") ||
    topicsJoined.includes("framework") ||
    topicsJoined.includes("sdk") ||
    topicsJoined.includes("api") ||
    topicsJoined.includes("tool") ||
    topicsJoined.includes("cli") ||
    topicsJoined.includes("python-library") ||
    topicsJoined.includes("npm-package") ||
    topicsJoined.includes("package") ||
    topicsJoined.includes("python-package") ||
    desc.includes("library") ||
    desc.includes("framework") ||
    desc.includes("sdk") ||
    desc.includes("toolkit") ||
    desc.includes("api") ||
    desc.includes("wrapper") ||
    desc.includes("client") ||
    desc.includes("integration") ||
    desc.includes("cli tool") ||
    desc.includes("command-line tool") ||
    desc.includes("api client") ||
    desc.includes("client library") ||
    desc.includes("python package");

  // Look for code/implementation indicators
  const hasCodeIndicators =
    (repo.language &&
      [
        "Python",
        "JavaScript",
        "TypeScript",
        "Rust",
        "Go",
        "C++",
        "Java",
        "C",
      ].includes(
        repo.language,
      )) ||
    name.endsWith("-py") ||
    name.endsWith("-js") ||
    name.endsWith("-ts") ||
    name.startsWith("py-") ||
    name.startsWith("js-");

  const hasEnhancedAISignals =
    anyIncludes(
      topics,
      "machine-learning",
      "deep-learning",
      "neural-network",
      "llm",
      "nlp",
      "computer-vision",
      "rag",
      "artificial-intelligence",
      "ai",
      "ml",
      "generative-ai",
      "transformers",
      "pytorch",
      "tensorflow",
      "interpretability",
      "explainable-ai",
      "xai",
      "prompt-engineering",
      "fine-tuning",
      "reinforcement-learning",
    ) ||
    textIncludes(desc, "machine learning") ||
    textIncludes(desc, "deep learning") ||
    textIncludes(desc, "artificial intelligence") ||
    textIncludes(desc, "neural network") ||
    textIncludes(desc, "llm") ||
    textIncludes(desc, "large language model") ||
    textIncludes(desc, "generative ai") ||
    textIncludes(desc, "interpretability") ||
    textIncludes(desc, "explainability") ||
    textIncludes(desc, "computer vision") ||
    textIncludes(desc, "natural language") ||
    textIncludes(desc, "rag") ||
    textIncludes(desc, "retrieval augmented") ||
    textIncludes(desc, "prompt engineering") ||
    textIncludes(desc, "fine-tuning") ||
    textIncludes(desc, "model training");

  const stars = repo.stargazers_count ?? 0;
  const owner = fullName.split("/")[0] || "";
  const fromCuratedOrg = AI_ORGS.map((o) => o.toLowerCase()).includes(
    owner.toLowerCase(),
  );

  // Relaxed criteria for high-star repos
  if (stars >= 5000 && hasEnhancedAISignals) return true;
  if (
    stars >= 2000 &&
    (hasStrongLibrarySignals || hasCodeIndicators) &&
    hasEnhancedAISignals
  ) {
    return true;
  }

  // Trusted orgs get more lenient treatment
  if (
    fromCuratedOrg &&
    hasEnhancedAISignals &&
    (hasStrongLibrarySignals || hasCodeIndicators)
  ) {
    return true;
  }

  // Standard criteria with relaxed requirements
  if (
    (hasStrongLibrarySignals || hasCodeIndicators) &&
    hasEnhancedAISignals &&
    stars >= 100
  ) {
    return true;
  }

  return false;
}

// Enhanced category classification
function inferCategory(repo: GitHubRepo): string {
  const topics = normalizeTopics(repo);
  const name = (repo.name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const combined = [name, desc, ...topics].join(" ");

  const has = (s: string) => combined.includes(s.toLowerCase());

  // More specific categorization
  if (
    has("prompt engineering") ||
    has("prompt-engineering") ||
    has("prompt optimization")
  ) {
    return "Prompt Engineering";
  }
  if (
    has("interpretability") ||
    has("explainability") ||
    has("explainable ai") ||
    has("xai") ||
    has("shap") ||
    has("lime") ||
    has("saliency")
  ) {
    return "Interpretability";
  }
  if (
    has("fine-tuning") ||
    has("fine-tune") ||
    has("peft") ||
    has("lora") ||
    has("qlora")
  ) {
    return "Fine-tuning";
  }
  if (
    has("agent") ||
    has("autonomous-agent") ||
    has("autonomous-agents") ||
    has("agentic")
  ) {
    return "Agent";
  }
  if (
    has("vector database") ||
    has("vector-db") ||
    has("vector search") ||
    has("faiss") ||
    has("qdrant") ||
    has("milvus") ||
    has("chroma") ||
    has("pinecone") ||
    has("weaviate")
  ) {
    return "Vector DB";
  }
  if (has("rag") || has("retrieval")) return "RAG / Retrieval";
  if (
    has("llm") ||
    has("large-language-model") ||
    has("gpt") ||
    has("transformer") ||
    has("llama") ||
    has("mistral") ||
    has("foundation model")
  ) {
    return "LLM / Model";
  }
  if (
    has("inference") ||
    has("serving") ||
    has("deployment") ||
    has("inference server") ||
    has("model serving")
  ) {
    return "Inference / Serving";
  }
  if (
    has("framework") ||
    has("pytorch") ||
    has("tensorflow") ||
    has("jax")
  ) {
    return "Framework";
  }
  if (
    has("sdk") ||
    has("api client") ||
    has("client library") ||
    has("api wrapper")
  ) {
    return "SDK / Client";
  }
  if (
    has("orchestration") ||
    has("pipeline") ||
    has("workflow") ||
    has("mlops")
  ) {
    return "Orchestration / MLOps";
  }
  if (
    has("monitoring") ||
    has("observability") ||
    has("evaluation") ||
    has("metrics") ||
    has("tracking")
  ) {
    return "Monitoring / Eval";
  }
  if (has("reinforcement learning") || has("rl")) {
    return "Reinforcement Learning";
  }
  if (has("time series") || has("forecasting")) {
    return "Time Series";
  }
  if (
    has("graph neural network") ||
    has("gnn") ||
    has("knowledge graph")
  ) {
    return "Graph ML";
  }
  if (
    has("audio") ||
    has("speech") ||
    has("voice") ||
    has("tts") ||
    has("stt")
  ) {
    return "Audio / Speech";
  }
  if (
    has("computer vision") ||
    has("image") ||
    has("video") ||
    has("cv")
  ) {
    return "Computer Vision";
  }
  if (has("nlp") || has("natural language")) {
    return "NLP";
  }
  if (
    has("data") ||
    has("preprocessing") ||
    has("annotation") ||
    has("labeling")
  ) {
    return "Data Tools";
  }
  if (
    has("ui") ||
    has("interface") ||
    has("gradio") ||
    has("streamlit")
  ) {
    return "UI / Interface";
  }

  return "Library";
}

// ---- GITHUB CALLS -----------------------------------------------------------

async function githubFetch(url: string, headers: Record<string, string>) {
  const resp = await fetch(url, { headers });
  if (resp.status === 403) {
    console.error("GitHub rate limit hit:", await resp.text());
    return null;
  }
  if (!resp.ok) {
    console.error("GitHub request failed:", resp.status, url, await resp.text());
    return null;
  }
  return resp.json();
}

async function searchGithubReposOnce(
  query: string,
  headers: Record<string, string>,
): Promise<GitHubRepo[]> {
  const pages = [1, 2, 3, 4]; // fetch 4 pages for better coverage
  const results: GitHubRepo[] = [];

  for (const page of pages) {
    const url =
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=50&page=${page}`;
    const data = await githubFetch(url, headers);
    if (!data || !data.items) continue;
    results.push(...(data.items as GitHubRepo[]));
  }

  return results;
}

async function fetchOrgReposOnce(
  org: string,
  headers: Record<string, string>,
): Promise<GitHubRepo[]> {
  const pages = [1, 2, 3]; // fetch 3 pages
  const results: GitHubRepo[] = [];

  for (const page of pages) {
    const url =
      `${GITHUB_API_BASE}/orgs/${org}/repos?type=public&sort=updated&per_page=50&page=${page}`;
    const data = await githubFetch(url, headers);
    if (!data || !Array.isArray(data)) continue;
    results.push(...data);
  }

  return results;
}

// NEW: ensure we fetch all MUST_INCLUDE_REPOS explicitly
async function fetchMustIncludeRepos(
  headers: Record<string, string>,
): Promise<GitHubRepo[]> {
  const results: GitHubRepo[] = [];
  console.log("Ensuring MUST_INCLUDE_REPOS are fetched explicitly...");

  for (const full of MUST_INCLUDE_REPOS) {
    const trimmed = full.trim();
    if (!trimmed) continue;
    const url = `${GITHUB_API_BASE}/repos/${trimmed}`;
    const data = await githubFetch(url, headers);
    if (!data) {
      console.warn(`Failed to fetch MUST_INCLUDE repo: ${trimmed}`);
      continue;
    }
    results.push(data as GitHubRepo);
  }

  console.log(
    `Explicit fetch complete for MUST_INCLUDE_REPOS. Retrieved: ${results.length}`,
  );
  return results;
}

async function collectGithubRepos(
  headers: Record<string, string>,
): Promise<GitHubRepo[]> {
  const seenIds = new Set<number>();
  const allRepos: GitHubRepo[] = [];

  console.log("Starting search-based discovery...");

  // Search-based discovery
  const searchResults = await Promise.allSettled(
    SEARCH_QUERIES.map((q) => searchGithubReposOnce(q, headers)),
  );

  for (const [idx, result] of searchResults.entries()) {
    if (result.status === "fulfilled") {
      for (const repo of result.value) {
        if (!repo || seenIds.has(repo.id)) continue;
        seenIds.add(repo.id);
        allRepos.push(repo);
      }
    } else {
      console.error("Search query failed:", SEARCH_QUERIES[idx], result.reason);
    }
  }

  console.log(`Search discovery complete: ${allRepos.length} unique repos found`);
  console.log("Starting org-based discovery...");

  // Org-based discovery
  const orgResults = await Promise.allSettled(
    AI_ORGS.map((org) => fetchOrgReposOnce(org, headers)),
  );

  for (const [idx, result] of orgResults.entries()) {
    if (result.status === "fulfilled") {
      for (const repo of result.value) {
        if (!repo || seenIds.has(repo.id)) continue;
        seenIds.add(repo.id);
        allRepos.push(repo);
      }
    } else {
      console.error("Org fetch failed:", AI_ORGS[idx], result.reason);
    }
  }

  console.log(
    `After org-based discovery: ${allRepos.length} unique repos collected`,
  );

  // NEW: Explicitly fetch all MUST_INCLUDE_REPOS and ensure they are present
  console.log("Starting explicit MUST_INCLUDE_REPOS collection...");
  const mustIncludeRepos = await fetchMustIncludeRepos(headers);

  for (const repo of mustIncludeRepos) {
    if (!repo) continue;

    // Check if already present by id OR full_name
    const alreadyPresentById = seenIds.has(repo.id);
    const alreadyPresentByName = allRepos.some(
      (r) =>
        r.full_name &&
        r.full_name.toLowerCase() === repo.full_name.toLowerCase(),
    );

    if (!alreadyPresentById && !alreadyPresentByName) {
      seenIds.add(repo.id);
      allRepos.push(repo);
      console.log(`Added MUST_INCLUDE repo: ${repo.full_name}`);
    } else {
      console.log(
        `MUST_INCLUDE repo already present (skipping duplicate): ${repo.full_name}`,
      );
    }
  }

  console.log(`Total raw repos collected (with MUST_INCLUDE): ${allRepos.length}`);
  return allRepos;
}

function mapReposToTools(repos: GitHubRepo[]): AiTool[] {
  const toolsMap = new Map<string, AiTool>(); // key: name (matches DB onConflict)

  for (const repo of repos) {
    if (!isLikelyAITool(repo)) continue;

    const category = inferCategory(repo);
    const stars = repo.stargazers_count ?? 0;

    const tool: AiTool = {
      name: repo.name,
      category,
      short_description: repo.description
        ? repo.description.substring(0, 200)
        : "No description available.",
      github_url: repo.html_url,
      github_stars: formatStars(stars),
      official_docs_url: repo.homepage || repo.html_url,
    };

    // NOTE: this still dedupes by name, since your DB uses `name` as onConflict
    if (!toolsMap.has(tool.name)) {
      toolsMap.set(tool.name, tool);
    }
  }

  const tools = Array.from(toolsMap.values());
  console.log(`Total tools after filtering: ${tools.length}`);
  return tools;
}

// ---- EDGE FUNCTION ----------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const githubToken = Deno.env.get("GITHUB_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set");
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Supabase-Edge-Function",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken && { Authorization: `token ${githubToken}` }),
    };

    console.log("Starting GitHub AI tools discovery...");

    // 1. Collect repos
    const allRepos = await collectGithubRepos(headers);

    // 2. Filter + map to tools
    const tools = mapReposToTools(allRepos);

    // 3. Upsert into Supabase in batches
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const chunks = chunkArray(tools, SUPABASE_UPSERT_BATCH_SIZE);
    console.log(
      `Upserting ${tools.length} tools in ${chunks.length} batches...`,
    );

    for (const [i, chunk] of chunks.entries()) {
      const { error: upsertError } = await supabase
        .from("ai_tools")
        .upsert(chunk, {
          onConflict: "name",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error(
          `Upsert batch ${i + 1}/${chunks.length} failed:`,
          upsertError.message,
        );
        throw upsertError;
      }
      console.log(`Batch ${i + 1}/${chunks.length} upserted successfully`);
    }

    console.log("Discovery complete!");

    return new Response(
      JSON.stringify({
        success: true,
        message:
          `Successfully discovered and updated ${tools.length} AI tools from GitHub`,
        stats: {
          total_repos_scanned: allRepos.length,
          total_tools_upserted: tools.length,
          search_queries_used: SEARCH_QUERIES.length,
          orgs_checked: AI_ORGS.length,
          must_include_count: MUST_INCLUDE_REPOS.length,
        },
        sample_tools: tools.slice(0, 10).map((t) => ({
          name: t.name,
          category: t.category,
          stars: t.github_stars,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message ?? "Unknown error",
        stack: error?.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
