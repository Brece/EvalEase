import '../../styles/SurveyStyles/navigation.css';

type NavigationNextProps = {
  onPrev: () => void;
};

export default function NavigationBack({ onPrev }: NavigationNextProps) {
  return (
    <button type="button" onClick={onPrev} className="navigation-button">
      &#8592; Zurück
    </button>
  );
}
