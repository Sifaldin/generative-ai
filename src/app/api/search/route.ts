import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { NextResponse } from "next/server"
import movies from "@/data/movies.json"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const q = searchParams.get("q")

  if (!q) {
    return new NextResponse(JSON.stringify({ message: "Missing query" }), {
      status: 400,
    })
  }

  const vectorStore = await HNSWLib.load("movies", new OpenAIEmbeddings())

  const searchResult = await vectorStore.similaritySearch(q, 1)

  const searchResultIds = searchResult.map((r: any) => r.metadata.id)

  let results = movies.filter((movie) => searchResultIds.includes(movie.id))

  return NextResponse.json({ results })
}