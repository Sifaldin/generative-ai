import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

let conversationChain: any = null;

export async function POST(req: Request) {
  const requestBody = await req.json();
  const userQuery = requestBody.query;
  console.log("requestBody.", requestBody.modelType);
  const modelType = requestBody.modelType;

  if (!conversationChain) {
    // If the conversation chain doesn't exist, create a new one
    const model = new OpenAI({});
    console.log("ModelType", modelType);
    const vectorStore = await HNSWLib.load(modelType, new OpenAIEmbeddings());
    const vectorStoreRetriever = vectorStore.asRetriever();
    conversationChain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
  }

  const res = await conversationChain.call({
    query: userQuery,
  });
  console.log({ res });

  return NextResponse.json({ res });
}
