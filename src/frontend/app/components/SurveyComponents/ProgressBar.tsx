import '../../styles/SurveyStyles/progressBar.css';

type ProgressBaProps = {
  progress: number; // Fortschritt als Prozentsatz
};

export default function ProgressBar({ progress }: ProgressBaProps) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        <p className="progress-number">{progress}%</p>
      </div>
    </div>
  );
}
