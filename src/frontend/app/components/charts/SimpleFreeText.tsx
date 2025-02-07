interface ISimpleFreeTextProps {
  data: string[];
}

/**
 * Simple free text view that lists all free text responses.
 */
export default function SimpleFreeText({ data }: ISimpleFreeTextProps) {
  return (
    <ul className="flex flex-col gap-4 ml-6 list-disc text-brand-5">
      {data.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </ul>
  );
}
