import React from 'react';

interface Props {
  text: string;
}

const Marquee: React.FC<Props> = ({ text }) => {
  const fullText = `${text} • `;
  return (
    <div className="bg-primary text-white text-sm font-medium overflow-hidden whitespace-nowrap rounded-t-lg -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 md:-mx-10 md:-mt-10 mb-6">
      <div className="inline-block animate-marquee py-2.5 px-4">
        <span>{fullText}</span>
        <span>{fullText}</span>
        <span>{fullText}</span>
        <span>{fullText}</span>
      </div>
       <div className="inline-block animate-marquee py-2.5 px-4">
        <span>{fullText}</span>
        <span>{fullText}</span>
        <span>{fullText}</span>
        <span>{fullText}</span>
      </div>
    </div>
  );
};

export default Marquee;
