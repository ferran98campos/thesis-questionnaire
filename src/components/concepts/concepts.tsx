import { useEffect, useState } from "react";
import "./styles.css";
import { setConstantValue } from "typescript";

export interface Concept {
  fatherConceptName: string;
  name: string;
  correctDefinitionIndex: number;
  definitions: string[];
  selected: boolean;
  chosenDefinition?: number;
  timeSpent?: number;
}

interface ConceptsComponentProps {
  concepts: Concept[];
  setChosenConcepts: (concepts: Concept[]) => void;
}

const ConceptsComponent: React.FC<ConceptsComponentProps> = ({
  concepts,
  setChosenConcepts,
}) => {
  const [fadeForm, setFadeForm] = useState<boolean>(false);
  const [formConcepts, setFormConcepts] = useState<Concept[]>(concepts);
  const [conceptsSelected, setConceptsSelected] = useState<boolean>(false);
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>([]);

  const uniqueConcepts: Concept[] = formConcepts.reduce(
    (acc: Concept[], concept: Concept) => {
      if (
        !acc.find(
          (item: Concept) =>
            item.fatherConceptName === concept.fatherConceptName
        )
      ) {
        acc.push(concept);
      }
      return acc;
    },
    []
  );

  const handleInputChange = (concept: Concept) => {
    const newConcept = {
      fatherConceptName: concept.fatherConceptName,
      name: concept.name,
      correctDefinitionIndex: concept.correctDefinitionIndex,
      definitions: [...concept.definitions],
      selected: !concept.selected,
    };
    setFormConcepts(
      formConcepts.map((foundConcept) =>
        foundConcept.name === concept.name ? newConcept : foundConcept
      )
    );
  };

  const handleSubmit = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form from submitting the traditional way
    const selectedConcepts = uniqueConcepts.filter(
      (concept) => concept.selected
    );
    if (selectedConcepts.length > 0) {
      const target = event.target as HTMLInputElement;
      target.className = target.className.concat(" clicked");
      setFadeForm(true);
      const timer = setTimeout(() => {
        // Action to perform after 400ms
        setFilteredConcepts(selectedConcepts);
        setConceptsSelected(true);
        setFadeForm(false);
        // You can perform other actions here
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  const handleConfirm = () => {
    setFadeForm(true);
    let finalConcepts: Concept[] = concepts.filter((concept) =>
      uniqueConcepts.find(
        (uniqueConcept) =>
          uniqueConcept.name === concept.fatherConceptName &&
          uniqueConcept.selected
      )
    );
    const timer = setTimeout(() => {
      // Action to perform after 400ms
      setChosenConcepts(finalConcepts);
      setConceptsSelected(true);

      // You can perform other actions here
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <div>
      {!conceptsSelected && (
        <section className={fadeForm ? "fade concepts" : "concepts"}>
          <h1>Choose the concepts you could provide a definition of</h1>
          <form>
            <div className="grid">
              {uniqueConcepts.map((concept) => (
                <div
                  key={concept.name}
                  className="grid-item"
                  onClick={(e) => handleInputChange(concept)}
                >
                  <input
                    type="checkbox"
                    checked={concept.selected}
                    onChange={() => {}}
                  />
                  <label>{concept.name}</label>
                </div>
              ))}
            </div>
            <input
              type="submit"
              value="Continue →"
              disabled={
                formConcepts.filter((concept) => concept.selected).length === 0
              }
              onClick={handleSubmit}
            />
          </form>
        </section>
      )}
      {conceptsSelected && (
        <section className="concepts">
          <h1>
            Are these the concepts you could <i>provide a definition of</i>?
          </h1>
          <div className="grid">
            {filteredConcepts.map((concept) => (
              <div key={concept.name} className="grid-item">
                <p>
                  <b>{concept.name}</b>
                </p>
              </div>
            ))}
          </div>
          <div className="buttonContainer">
            <button
              className="yesButton"
              onClick={() => {
                handleConfirm();
              }}
            >
              Yes, proceed
            </button>
            <button
              className="noButton"
              onClick={() => {
                setConceptsSelected(false);
              }}
            >
              No, go back
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ConceptsComponent;
