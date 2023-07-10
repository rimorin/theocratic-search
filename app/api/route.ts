import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX } = process.env;
const OpenAiLLM = new OpenAI({ temperature: 0 });

const COMMON_TEMPLATE = `If you don't know the answer, just say that you don't know.
Do not use outside sources.
Include scripture references if applicable.
Use the NWT translation when quoting scriptures.`;

const PROMPT_TEMPLATE = `
Your task is to answer the following question:

{question}

${COMMON_TEMPLATE}
`;
const LLMPrompt = new PromptTemplate({
  template: PROMPT_TEMPLATE,
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

export async function POST(request: Request) {
  const { question, chats } = await request.json();

  // check empty question
  if (!question) {
    return new Response(
      JSON.stringify({
        error: "Empty question",
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
  const prompt = await LLMPrompt.format({ question: question });
  const pineconeIndex = await initialisePinconeIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const chain = ConversationalRetrievalQAChain.fromLLM(
    OpenAiLLM,
    vectorStore.asRetriever()
  );

  const chatsString = chats
    .map((chat: any) => {
      // if chat is a question, return the question
      if (chat.type === "question") {
        return `Human: ${chat.message}`;
      }
      // if chat is an answer, return the question and answer
      return `AI: ${chat.message}`;
    })
    .join("\n");

  const response = await chain.call({
    question: prompt,
    chat_history: chatsString,
  });
  return new Response(JSON.stringify(response));
}
