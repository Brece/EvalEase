import '../../styles/SurveyStyles/navigation.css';

type NavigationNextProps = {
  onNext: () => void;
};

export default function NavigationNext({ onNext }: NavigationNextProps) {
  return (
    <button type="button" onClick={onNext} className="navigation-button">
      Weiter &#8594;
    </button>
  );
}
