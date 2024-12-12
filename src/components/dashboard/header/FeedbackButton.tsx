import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import FeedbackModal from '../../feedback/FeedbackModal';
import Tooltip from '../../common/Tooltip';

export default function FeedbackButton() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <Tooltip text="Submit Feedback">
        <button
          onClick={() => setShowFeedback(true)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </Tooltip>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
}