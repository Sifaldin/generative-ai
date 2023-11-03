require("dotenv").config();
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import movies from "../../data/movies.json";
import books from "../../data/books.json";
import { JSONLoader } from "langchain/document_loaders/fs/json";

export const generateEmbeddingsForBooks = async () => {
  try {
    const start = performance.now() / 1000;

    const textsToEmbed = books.map((book) => JSON.stringify(book));

    const metadata = movies.map((movie) => ({ id: movie.id }));

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromTexts(
      textsToEmbed,
      metadata,
      embeddings
    );

    // saves the embeddings in the ./movies directory in the root directory
    await vectorStore.save("books");

    const end = performance.now() / 1000;

    console.log(`Took ${(end - start).toFixed(2)}s`);
  } catch (error) {
    console.error(error);
  }
};
