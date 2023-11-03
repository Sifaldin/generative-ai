import { generateEmbeddingsForBooks } from "@/app/functions/generateEmbeddingsForBooks";
import { generateEmbeddingsForMovies } from "@/app/functions/generateEmbeddingsForMovies";
import { generateEmbeddingsForAnimals } from "@/app/functions/generateEmbeddingsForAnimals";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};

export async function GET() {
  generateEmbeddingsForMovies();
  generateEmbeddingsForBooks();
  generateEmbeddingsForAnimals();
  return NextResponse.json({ generated: true });
}
