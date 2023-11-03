import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// http://localhost:3000/api/textToVector?q=test
export async function GET(request: Request) {
  //   generateEmbeddings()

  const { searchParams } = new URL(request.url);

  const embeddings = new OpenAIEmbeddings();

  const queryString = searchParams.get("q") || "";

  const response = await embeddings.embedQuery(queryString);

  // Convert the text to a vector.

  return NextResponse.json({ data: response });
}
