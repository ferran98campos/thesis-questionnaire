import { useEffect, useState, useRef } from "react";
import { Concept } from "../../concepts/concepts";
import "./styles.css";

interface QuestionComponentProps {
  concept: Concept;
  next: (concept: Concept) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  concept,
  next,
}) => {
  const [questionConcept, setQuestionConcept] = useState<Concept>(concept);
  const intervalId = useRef<number | null>(null);
  const time = useRef<number>(0);
  useEffect(() => {
    intervalId.current = window.setInterval(() => {
      time.current = time.current + 1; // Increment time by 1 every second
    }, 1000);
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [concept.name]);

  useEffect(() => {
    setQuestionConcept(concept);
  }, [concept]);

  return (
    <div className="questionDiv">
      <div className="questionInstructions">
        <p>
          Choose the <b>correct definition</b> for the concept:
        </p>
        <h1>"{questionConcept.fatherConceptName}"</h1>
      </div>

      <div className="answerDiv">
        {questionConcept.definitions.map((definition, index) => (
          <div
            className={
              questionConcept.chosenDefinition === index
                ? "answerContainer selected"
                : "answerContainer"
            }
            onClick={() => {
              let newIndex =
                questionConcept.chosenDefinition === index ? undefined : index;
              const newConcept: Concept = {
                fatherConceptName: concept.fatherConceptName,
                name: concept.name,
                correctDefinitionIndex: concept.correctDefinitionIndex,
                chosenDefinition: newIndex,
                definitions: [...concept.definitions],
                selected: concept.selected,
              };
              setQuestionConcept(newConcept);
            }}
          >
            <p>{definition}</p>
          </div>
        ))}
      </div>

      <div className="buttonDiv">
        <button
          className="noButton"
          onClick={() => {
            const newConcept: Concept = {
              fatherConceptName: questionConcept.fatherConceptName,
              name: questionConcept.name,
              correctDefinitionIndex: questionConcept.correctDefinitionIndex,
              chosenDefinition: questionConcept.chosenDefinition,
              definitions: [...questionConcept.definitions],
              selected: questionConcept.selected,
              timeSpent: time.current,
            };
            next(newConcept);
            if (intervalId.current) {
              clearInterval(intervalId.current);
              time.current = 0;
            }
          }}
          disabled={questionConcept.chosenDefinition !== undefined}
        >
          Skip
        </button>
        <button
          className="yesButton"
          onClick={() => {
            const newConcept: Concept = {
              fatherConceptName: questionConcept.fatherConceptName,
              name: questionConcept.name,
              correctDefinitionIndex: questionConcept.correctDefinitionIndex,
              chosenDefinition: questionConcept.chosenDefinition,
              definitions: [...questionConcept.definitions],
              selected: questionConcept.selected,
              timeSpent: time.current,
            };
            next(newConcept);
            if (intervalId.current) {
              clearInterval(intervalId.current);
              time.current = 0;
            }
          }}
          disabled={questionConcept.chosenDefinition === undefined}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionComponent;
