import "../../styles/SurveyStyles/headline.css";


type HeadlineProps = {
  titel: string;
};

export default function Headline({titel} : HeadlineProps) {
  
  return (
      <div className="headline-container">
          <h1 className="headline-text">{titel}</h1>
      </div>
  );
}
