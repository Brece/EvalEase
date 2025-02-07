import WordCloud, { Scale } from 'react-wordcloud';
import nlp from 'compromise';
import { removeStopwords } from 'stopword';
import { useEffect, useState } from 'react';

interface IFreeTextWordCloudProps {
  data: string[];
}

/**
 * Free text word cloud component.
 */
export default function FreeTextWordCloud({
  data = [],
}: IFreeTextWordCloudProps) {
  const [wordCloudData, setWordCloudData] = useState<
    { text: string; value: number }[]
  >([]);

  // Word cloud options to disable animations and enforce horizontal layout
  const options = {
    rotations: 0, // Disable rotation (ensures all words are horizontal)
    enableTooltip: false, // Disable hover tooltips (optional)
    deterministic: true, // Keeps the same word positions on re-renders
    fontSizes: [14, 48] as [number, number], // Adjust font size range
    transitionDuration: 0, // Disables animations
    scale: 'linear' as Scale, // Keeps word sizes proportional
  };

  useEffect(() => {
    if (!data.length) return;

    const processText = () => {
      const allText = data.join(' ');

      // Extract nouns & verbs (ignoring stopwords)
      const doc = nlp(allText).nouns().out('array');
      const filteredWords = removeStopwords(doc).filter(
        (word) => word.length > 3,
      );

      // Count word occurrences
      const wordMap = filteredWords.reduce(
        (acc: Record<string, number>, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        },
        {},
      );

      // Convert to word cloud format
      setWordCloudData(
        Object.entries(wordMap).map(([text, value]) => ({ text, value })),
      );
    };

    processText();
  }, [data]);

  return (
    <div className="w-full">
      <WordCloud words={wordCloudData} options={options} />
    </div>
  );
}
