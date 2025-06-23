import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { MisinformationReport } from '../../types';
import { dataService } from '../../services/dataService';

interface MisinformationReporterProps {
  alertId: string;
  lowPowerMode: boolean;
  onReportSubmitted?: (report: MisinformationReport) => void;
}

const MisinformationReporter: React.FC<MisinformationReporterProps> = ({
  alertId,
  lowPowerMode,
  onReportSubmitted
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reason: 'fake_news' as const,
    description: ''
  });

  const reportReasons = [
    { value: 'fake_news', label: 'Fake News', description: 'Information is false or fabricated' },
    { value: 'misleading', label: 'Misleading', description: 'Information is partially true but misleading' },
    { value: 'spam', label: 'Spam', description: 'Irrelevant or repetitive content' },
    { value: 'inappropriate', label: 'Inappropriate', description: 'Content is offensive or inappropriate' },
    { value: 'other', label: 'Other', description: 'Other concerns not listed above' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const report: MisinformationReport = {
        id: Date.now().toString(),
        alertId,
        reportedBy: 'user', // In real app, this would be the actual user ID
        reason: formData.reason,
        description: formData.description,
        timestamp: Date.now(),
        status: 'pending'
      };

      await dataService.saveMisinformationReport(report);
      onReportSubmitted?.(report);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFormData({ reason: 'fake_news', description: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          lowPowerMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Flag className="w-4 h-4" />
        <span>Report Issue</span>
      </button>
    );
  }

  if (isSubmitted) {
    return (
      <div className={`${lowPowerMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          <CheckCircle className={`w-5 h-5 ${lowPowerMode ? 'text-green-400' : 'text-green-600'}`} />
          <div>
            <h4 className={`font-semibold ${lowPowerMode ? 'text-green-400' : 'text-green-800'}`}>
              Report Submitted
            </h4>
            <p className={`text-sm ${lowPowerMode ? 'text-green-300' : 'text-green-700'}`}>
              Thank you for helping keep our community safe. Your report will be reviewed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${lowPowerMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flag className={`w-5 h-5 ${lowPowerMode ? 'text-red-400' : 'text-red-600'}`} />
          <h3 className={`font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
            Report Misinformation
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className={`text-sm ${lowPowerMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Reason Selection */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            What's the issue?
          </label>
          <div className="space-y-2">
            {reportReasons.map((reason) => (
              <label
                key={reason.value}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.reason === reason.value
                    ? lowPowerMode
                      ? 'border-red-500 bg-red-900 bg-opacity-20'
                      : 'border-red-500 bg-red-50'
                    : lowPowerMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.value}
                  checked={formData.reason === reason.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value as any }))}
                  className="mt-1"
                />
                <div>
                  <div className={`font-medium ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                    {reason.label}
                  </div>
                  <div className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {reason.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Additional Details (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              lowPowerMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Please provide any additional context that might help us understand the issue..."
          />
        </div>

        {/* Warning */}
        <div className={`p-3 rounded-lg ${lowPowerMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
          <div className="flex items-start space-x-2">
            <AlertTriangle className={`w-4 h-4 mt-0.5 ${lowPowerMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className={`text-sm ${lowPowerMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <strong>Important:</strong> False reports can harm community trust. Please only report content you genuinely believe is problematic.
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              lowPowerMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MisinformationReporter;