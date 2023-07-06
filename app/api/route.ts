import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
const { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX } = process.env;
const PARAM_NAME = "query";
const ADDITIONAL_PROMPT =
  "Provide scriptural references to support your answer.";
const OpenAiLLM = new OpenAI({ temperature: 0 });

const initialisePinconeIndex = async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: PINECONE_API_KEY || "",
    environment: PINECONE_ENVIRONMENT || "",
  });

  return client.Index(PINECONE_INDEX || "");
};

export async function GET(request: Request) {
  // check empty request
  if (!request) {
    return new Response(
      JSON.stringify({
        error: "Empty request",
      })
    );
  }
  // check empty query parameter
  if (!request.url) {
    return new Response(
      JSON.stringify({
        error: "Empty query parameter",
      })
    );
  }
  // check missing environment variables
  if (!PINECONE_API_KEY || !PINECONE_ENVIRONMENT || !PINECONE_INDEX) {
    return new Response(
      JSON.stringify({
        error: "Missing environment variables",
      })
    );
  }

  const params = new URL(request.url).searchParams;
  const query = params.get(PARAM_NAME);
  const pineconeIndex = await initialisePinconeIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );
  const chain = VectorDBQAChain.fromLLM(OpenAiLLM, vectorStore, {
    k: 1,
  });

  const response = await chain.call({
    query: `${query}. ${ADDITIONAL_PROMPT}`,
  });
  return new Response(JSON.stringify(response));
}
