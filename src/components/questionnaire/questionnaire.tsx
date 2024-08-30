import { useState } from "react";
import { Concept } from "../concepts/concepts";
import "./styles.css";
import QuestionComponent from "./components/question";
import ResultsComponent from "../results/results";
interface QuestionnaireComponentProps {
  concepts: Concept[];
  setConcepts: (concepts: Concept[]) => void;
  participantID: number | undefined;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({
  concepts,
  setConcepts,
  participantID,
}) => {
  const [questionnaireStarted, setQuestionnaireStarted] =
    useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const handleNextQuestion = (newConcept: Concept) => {
    concepts = concepts.map((concept) =>
      concept.name === newConcept.name ? newConcept : concept
    );
    setConcepts(concepts);
    setQuestionNumber(questionNumber + 1);
  };

  return (
    <div>
      {!questionnaireStarted && (
        <section className="centered">
          <h1>Everything is ready!</h1>
          <p>
            You will now go through a questionnaire with{" "}
            <b>{concepts.length} questions</b> regarding the concepts you have
            chosen.
          </p>
          <p>
            Read the question carefully and <b>select the right answer</b>! You
            will have <u>4 possible answers</u> to choose from.
          </p>
          <p>
            Once you choose your answer,{" "}
            <b>
              you will be able to change it as long as you haven´t pressed the{" "}
              <i>Next</i> button
            </b>{" "}
            Once you do so, you won´t be able to come back and change it back.
          </p>
          <p>
            <b>
              In case you don´t know the answer, or you are unsure, please skip
              the question.
            </b>
          </p>
          <button
            className="start"
            onClick={() => {
              setQuestionnaireStarted(true);
            }}
          >
            Start!
          </button>
        </section>
      )}
      {questionnaireStarted && questionNumber < concepts.length && (
        <section className="centered">
          <QuestionComponent
            concept={concepts[questionNumber]}
            next={handleNextQuestion}
          />
        </section>
      )}
      {questionNumber >= concepts.length && (
        <ResultsComponent concepts={concepts} participantID={participantID} />
      )}
    </div>
  );
};

export default QuestionnaireComponent;
