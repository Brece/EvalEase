import { useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';

import Button from '../components/Button';
import { Modal } from '../components/Modal';
import { urls } from '../utils/urls';

const TOOLTIPS_CONFIG: Record<string, any> = {
  [urls.evaluation]: {
    title: 'Evaluation Results',
    component: <EvaluationTooltip />,
  },
  [urls.presentation]: {
    title: 'Create Presentation',
    component: <PresentationTooltip />,
  },
  [urls.surveyBuilder]: {
    title: 'Survey Builder',
    component: <SurveyBuilderTooltip />,
  },
  [urls.home]: {
    title: 'Welcome to the application!',
    component: <HomeTooltip />,
  },
  error: {
    title: 'Sorry!',
    component: <p>No tutorial available for this page.</p>,
  },
};

export function useTooltips() {
  const location = useLocation();
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  // Find the closest matching route (handles dynamic paths like "/evaluation/:id")
  const matchedConfig = useMemo(() => {
    const matchedKey =
      Object.keys(TOOLTIPS_CONFIG).find((key) =>
        location.pathname.startsWith(key),
      ) || 'error';

    return TOOLTIPS_CONFIG[matchedKey]; // Return the matched tooltip config
  }, [location.pathname]);

  // Function to render the tooltip modal inside consuming components
  const TooltipModal = () => (
    <Modal
      title={matchedConfig.title}
      isOpen={tooltipIsOpen}
      setIsOpen={setTooltipIsOpen}
    >
      {matchedConfig.component}
      <Button label="Close" onClick={() => setTooltipIsOpen(false)} />
    </Modal>
  );

  return { TooltipModal, setTooltipIsOpen };
}

function HomeTooltip() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Pages</h3>
        <ul className="list-disc pl-5">
          <li className="text-brand-3">Home - Dashboard of past evaluations</li>
          <li>Evaluation - result details</li>
          <li>
            Presentation - create presentation for selected evaluation results
          </li>
          <li>Survey Builder - create your own survey</li>
          <li>Profile - user credentials</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-2xl font-semibold">How to navigate...</h3>
        <p className="mb-2">
          All pages are structured similarly for ease of use. If you feel lost
          you can review tooltip on each page.
        </p>
        <p className="mb-2">
          On the left side you have access to all available actions based on the
          current page or selected items.
        </p>
        <p className="mb-2">
          On the right side the content of the current page or selected item is
          displayed. You also have access to different tabs that display the
          content in different ways.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-2xl font-semibold text-brand-3">Home</h3>
        <p>
          On your dashboard, you can view all your past evaluations results
          which you can add to your favorites or delete. You have to following
          actions available:
        </p>
        <ul className="list-disc pl-5">
          <li>Search - search or filter based of evaluation name</li>
          <li>Sort Options - various sort options</li>
          <li>Actions - create survey etc.</li>
          <li>Help - tooltips</li>
        </ul>
      </div>
    </div>
  );
}

function EvaluationTooltip() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Pages</h3>
        <ul className="list-disc pl-5">
          <li>Home - Dashboard of past evaluations</li>
          <li className="text-brand-3">Evaluation - result details</li>
          <li>
            Presentation - create presentation for selected evaluation results
          </li>
          <li>Survey Builder - create your own survey</li>
          <li>Profile - user credentials</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-2xl font-semibold text-brand-3">
          Evaluation Results
        </h3>
        <p className="mb-2">
          On the evaluation results page the previously selected evaluation is
          deiplayed in more detail. The results are shown as different chart
          views which you can customize and filter. You have the following
          actions available:
        </p>
        <ul className="list-disc pl-5">
          <li>Filter Options - filter charts based on type</li>
          <li>Sections - filter based on categories</li>
          <li>EvalManager - generate QR-Code etc.</li>
          <li>Create Presentation - navigate to presentation view</li>
          <li>Help - tooltips</li>
        </ul>
      </div>
    </div>
  );
}

function PresentationTooltip() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Pages</h3>
        <ul className="list-disc pl-5">
          <li>Home - Dashboard of past evaluations</li>
          <li>Evaluation - result details</li>
          <li className="text-brand-3">
            Presentation - create presentation for selected evaluation results
          </li>
          <li>Survey Builder - create your own survey</li>
          <li>Profile - user credentials</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-2xl font-semibold text-brand-3">
          Create Presentation
        </h3>
        <p className="mb-2">
          On the presentation page the previously selected evaluation is
          deiplayed and can be modified for the presentation. The results can be
          toggled to be visible or not. You have the following actions
          available:
        </p>
        <ul className="list-disc pl-5">
          <li>EvalManager - set all results to be visible etc.</li>
          <li>Sections - filter based on categories</li>
          <li>
            Generate QR-Code - download QR-Code or get shareable link for
            presentation
          </li>
          <li>Help - tooltips</li>
        </ul>
      </div>
    </div>
  );
}

function SurveyBuilderTooltip() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Pages</h3>
        <ul className="list-disc pl-5">
          <li>Home - Dashboard of past evaluations</li>
          <li>Evaluation - result details</li>
          <li>
            Presentation - create presentation for selected evaluation results
          </li>
          <li className="text-brand-3">
            Survey Builder - create your own survey
          </li>
          <li>Profile - user credentials</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-2xl font-semibold text-brand-3">
          Survey Builder
        </h3>
        <p className="mb-2">
          On the survey builder page you can create your own new survey based on
          the default template or copy and edit an existing one. The available
          actions depend on wether the default or a custom template is selected.
        </p>
        <p className="mb-2">
          You can add custom "free text" or various "checkbox" type questions at
          the end of the page. Custom questions can be deleted or like any other
          questions sorted within their category via "drag&drop".
        </p>
        <p className="mb-2">You have the following actions available:</p>
        <ul className="list-disc pl-5">
          <li>MyTemplates - default template and your created templates</li>
          <li>Sections - filter based on categories</li>
          <li>
            Create Survey (default template selected) - create new survey based
            of the default template
          </li>
          <li>
            Generate QR-Code - download QR-Code or get shareable link for
            presentation
          </li>
          <li>Edit Title</li>
          <li>Copy Survey - copy selected custom template</li>
          <li>Delete Survey</li>
          <li>Help - tooltips</li>
        </ul>
      </div>
    </div>
  );
}
