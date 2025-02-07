import { ReactNode } from 'react';

import Button from './Button';

interface IEvaluationContainerProps {
  tabs: { label: string; value: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

/**
 * EvaluationContainer is a wrapper component for the right column content of most pages with different tabs.
 * @param tabs - An array of tab configurations.
 * @param activeTab - The active tab value.
 * @param onTabChange - A function to handle tab changes.
 * @param children - The content to display in the container.
 * @returns An evaluation container component.
 */
export default function EvaluationContainer({
  tabs,
  activeTab,
  onTabChange,
  children,
}: IEvaluationContainerProps) {
  return (
    <div className="w-full">
      <div className="mb-2">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            onClick={() => onTabChange(tab.value)}
            label={tab.label}
            className="min-w-[280px] mr-4 px-8 font-semibold text-2xl rounded-t-md rounded-b-none"
            color={activeTab === tab.value ? 'active' : 'inactive'}
          />
        ))}
      </div>
      {children ? (
        <div className="flex flex-col gap-y-8 p-8 bg-brand-12">{children}</div>
      ) : (
        <div className="p-8 bg-brand-12 text-center">
          Nothing to show here...
        </div>
      )}
    </div>
  );
}
