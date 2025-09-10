import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQAccordionProps {
  items: FAQItem[];
}
const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return <div className="space-y-4">
      {items.map((item, index) => <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50" onClick={() => toggleItem(index)}>
            <span className="font-medium text-gray-900">{item.question}</span>
            {openIndex === index ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {openIndex === index && <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-700">{item.answer}</p>
            </div>}
        </div>)}
    </div>;
};
export default FAQAccordion;