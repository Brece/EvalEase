import "../../styles/SurveyStyles/navigation.css";


type SubmitButtonProps = {
  submit: () => void;
};

export default function SubmitButton({ submit } : SubmitButtonProps) {
  
  return (
    <button type="submit" onClick={submit} className="absenden-button">
        Absenden
    </button>
  );
}
