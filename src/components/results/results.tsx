import { useState } from "react";
import { Concept } from "../concepts/concepts";

interface ResultsComponentProps {
  participantID: number | undefined;
  concepts: Concept[];
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  participantID,
  concepts,
}) => {
  // Function to download the CSV file
  const download = (csvdata: string) => {
    // Create a Blob with the CSV data and type
    const blob = new Blob([csvdata], { type: "text/csv" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor tag for downloading
    const a = document.createElement("a");

    // Set the URL and download attribute of the anchor tag
    a.href = url;
    a.download = participantID + "results.csv";

    // Trigger the download by clicking the anchor tag
    a.click();
    console.log(csvdata);
  };

  // Function to create a CSV string from an object
  const csvmaker = () => {
    let data: string[] = [];
    let numCorrects = 0;
    let numIncorrects = 0;
    let numSkipped = 0;
    let totalTime = 0;

    data[0] = participantID ? participantID.toString() : "UNDEFINED";

    data.push(
      [
        numCorrects,
        numIncorrects,
        numSkipped,
        totalTime / concepts.length,
        totalTime,
      ].join(";")
    );

    concepts.forEach((concept, index) => {
      concept.chosenDefinition === concept.correctDefinitionIndex
        ? numCorrects++
        : numIncorrects++;

      numSkipped += concept.chosenDefinition === undefined ? 1 : 0;

      totalTime += concept.timeSpent ? concept.timeSpent : 0;

      data[index + 1] = [
        concept.fatherConceptName,
        concept.name,
        concept.chosenDefinition === concept.correctDefinitionIndex,
        concept.timeSpent,
        concept.definitions[concept.correctDefinitionIndex],
        concept.chosenDefinition !== undefined
          ? concept.definitions[concept.chosenDefinition]
          : "",
      ].join(";");
    });

    // Join the headers and values with commas and newlines to create the CSV string
    return data.join("\n");
  };
  const get = async () => {
    // Create the CSV string from the data
    const csvdata = csvmaker();

    // Download the CSV file
    download(csvdata);
  };
  return (
    <section className="centered">
      <h1>That's the end of the study</h1>
      <h2>Please do not close this window </h2>
      <h3>Thanks for participating!</h3>
      <button onClick={get}>Download Results </button>
    </section>
  );
};

export default ResultsComponent;
