import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain";

export const runtime = "edge";

const { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX } = process.env;
const PARAM_NAME = "query";
const OpenAiLLM = new OpenAI({ temperature: 0 });

const TEMPLATE = `Answer the following QUESTION using only the documents provided. 
Do not use any outside sources.
If you don't know the answer, just say that you don't know. 
Don't try to make up an answer.
If you know the answer, explain it using the bible references in the documents.
When quoting a scripture, use the Jehovah's Witnesses New World Translation of the Holy Scriptures.

QUESTION: {question}
`;
const LLMPrompt = new PromptTemplate({
  template: TEMPLATE,
  inputVariables: ["question"],
});

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
  // check empty query parameter
  if (!query) {
    return new Response(
      JSON.stringify({
        error: "Empty query parameter",
      })
    );
  }

  const question = await LLMPrompt.format({ question: query });
  const pineconeIndex = await initialisePinconeIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );
  const chain = RetrievalQAChain.fromLLM(OpenAiLLM, vectorStore.asRetriever());

  const response = await chain.call({
    query: question,
  });
  return new Response(JSON.stringify(response));
}
