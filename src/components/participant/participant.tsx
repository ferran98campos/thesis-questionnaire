import { useRef, useState } from "react";
import "./styles.css";

export interface Participant {
  id: number;
}

interface ParticipantComponentProps {
  setParticipant: (participant: Participant) => void;
}

const ParticipantComponent: React.FC<ParticipantComponentProps> = ({
  setParticipant,
}) => {
  const [participantID, setParticipantID] = useState<number | undefined>();
  const [formVisible, setformVisible] = useState<boolean>(false);
  const [fadeForm, setFadeForm] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const checkParticipantID = (value: string) => {
    return /^\d{0,3}$/.test(value);
  };

  const handleID = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (checkParticipantID(value)) {
      setParticipantID(value === "" ? undefined : Number(value));
    }

    if (value.length === 3) setformVisible(true);
    else setformVisible(false);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form from submitting the traditional way

    if (participantID) {
      const target = event.target as HTMLInputElement;
      target.className = target.className.concat(" clicked");
      const participant: Participant = {
        id: participantID,
      };
      setFadeForm(true);
      const timer = setTimeout(() => {
        // Action to perform after 400ms
        setParticipant(participant);
        // You can perform other actions here
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  return (
    <section className={fadeForm ? "fade centered" : "centered"}>
      <h1>Type in your participant ID number</h1>
      <form>
        <input
          type="number"
          value={participantID !== undefined ? participantID : ""}
          onChange={handleID}
          ref={inputRef}
          onBlur={focusInput}
          autoFocus
        />
        <input
          type="submit"
          value="Start →"
          disabled={!formVisible}
          onClick={handleSubmit}
        />
      </form>
    </section>
  );
};

export default ParticipantComponent;
