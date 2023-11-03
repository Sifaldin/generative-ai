require("dotenv").config();
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import movies from "../../data/movies.json";

export const generateEmbeddingsForMovies = async () => {
  try {
    const start = performance.now() / 1000;

    const textsToEmbed = movies.map(
      (movie) =>
        `Title:${movie.name}\n\nyear: ${
          movie.year
        }\n\nactors: ${movie.actors.join(", ")}\n\nstoryline: ${
          movie.storyline
        }\n\n`
    );

    const metadata = movies.map((movie) => ({ id: movie.id }));

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromTexts(
      textsToEmbed,
      metadata,
      embeddings
    );

    // saves the embeddings in the ./movies directory in the root directory
    await vectorStore.save("movies");

    const end = performance.now() / 1000;

    console.log(`Took ${(end - start).toFixed(2)}s`);
  } catch (error) {
    console.error(error);
  }
};
