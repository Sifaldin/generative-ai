require("dotenv").config();
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import animals from "../../data/animals.json";

export const generateEmbeddingsForAnimals = async () => {
  try {
    const start = performance.now() / 1000;

    const textsToEmbed = animals.map(
      (animal) =>
        `Title:${animal.animal_name}\n\npredation: ${animal.predator}\n\nLegs: ${animal.legs}\n\nAquatic: ${animal.aquatic}\n\nTail: ${animal.tail}\n\nDomestic: ${animal.domestic}\n\n`
    );

    const metadata = animals.map((movie) => ({ id: movie.animal_name }));

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromTexts(
      textsToEmbed,
      metadata,
      embeddings
    );

    // saves the embeddings in the ./animals directory in the root directory
    await vectorStore.save("animals");

    const end = performance.now() / 1000;

    console.log(`Took ${(end - start).toFixed(2)}s`);
  } catch (error) {
    console.error(error);
  }
};
