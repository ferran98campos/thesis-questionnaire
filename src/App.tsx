import { useState, useEffect } from "react";
import ParticipantComponent, {
  Participant,
} from "./components/participant/participant";
import ConceptsComponent, { Concept } from "./components/concepts/concepts";
import QuestionnaireComponent from "./components/questionnaire/questionnaire";

function App() {
  const [participant, setParticipant] = useState<Participant | undefined>(
    undefined
  );
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [chosenConcepts, setChosenConcepts] = useState<Concept[]>([]);

  const shuffleArray = (array: string[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  };

  useEffect(() => {
    // Fetch the CSV file
    fetch("/concepts.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csvText) => {
        const concepts: Concept[] = [];
        csvText.split("\n").forEach((row: string) => {
          let data: string[] = row.split(";");
          let definitions = [];
          for (let i = 3; i < data.length; i++) definitions.push(data[i]);
          let shuffleDefinitions = shuffleArray(definitions);
          const newConcept: Concept = {
            fatherConceptName: data[0],
            name: data[1],
            correctDefinitionIndex: shuffleDefinitions.indexOf(
              definitions[+data[2]]
            ),
            definitions: shuffleDefinitions,
            selected: false,
          };
          concepts.push(newConcept);
        });
        setConcepts(concepts);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div>
      {chosenConcepts.length === 0 && (
        <div>
          {!participant && (
            <ParticipantComponent setParticipant={setParticipant} />
          )}
          {participant && (
            <ConceptsComponent
              concepts={concepts}
              setChosenConcepts={setChosenConcepts}
            />
          )}
        </div>
      )}
      {chosenConcepts.length > 0 && (
        <QuestionnaireComponent
          concepts={chosenConcepts}
          setConcepts={setChosenConcepts}
          participantID={participant?.id}
        />
      )}
    </div>
  );
}

export default App;
