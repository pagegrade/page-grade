'use client';

interface FeedbackReportProps {
  feedback: {
    grade: string;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    overall: string;
  };
}

export function FeedbackReport({ feedback }: FeedbackReportProps) {
     const getGradeColor = (grade: string) => {
     switch (grade.toUpperCase()) {
       case 'A+':
       case 'A':
         return 'bg-green-100 text-green-800 border-green-200';
       case 'B':
         return 'bg-blue-100 text-blue-800 border-blue-200';
       case 'C':
         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
       case 'D':
         return 'bg-orange-100 text-orange-800 border-orange-200';
       case 'F':
         return 'bg-red-100 text-red-800 border-red-200';
       default:
         return 'bg-gray-100 text-gray-800 border-gray-200';
     }
   };

  return (
    <div className="mt-8 space-y-6">
      {/* Grade Badge */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 font-bold text-3xl ${getGradeColor(feedback.grade)}`}>
          {feedback.grade}
        </div>
        <p className="text-sm text-gray-600 mt-2">Overall Grade</p>
      </div>

      {/* Good Elements */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">✅</span>
          <h3 className="text-lg font-semibold text-green-900">What&apos;s Good</h3>
        </div>
                 <div className="text-green-800 space-y-3">
           {feedback.strengths.map((strength, index) => (
             <div key={index} className="flex items-start">
               <span className="text-green-600 mr-2 mt-1">•</span>
               <div className="text-sm leading-relaxed">
                 {strength.split(':').length > 1 ? (
                   <>
                     <span className="font-semibold text-green-900">{strength.split(':')[0]}:</span>
                     <span className="text-green-800">{strength.split(':').slice(1).join(':')}</span>
                   </>
                 ) : (
                   <span className="text-green-800">{strength.replace(/'/g, '&apos;')}</span>
                 )}
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Issues to Fix */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🛠️</span>
          <h3 className="text-lg font-semibold text-orange-900">What Needs Work</h3>
        </div>
                 <div className="text-orange-800 space-y-3">
           {feedback.improvements.map((improvement, index) => (
             <div key={index} className="flex items-start">
               <span className="text-orange-600 mr-2 mt-1">•</span>
               <div className="text-sm leading-relaxed">
                 {improvement.split(':').length > 1 ? (
                   <>
                     <span className="font-semibold text-orange-900">{improvement.split(':')[0]}:</span>
                     <span className="text-orange-800">{improvement.split(':').slice(1).join(':')}</span>
                   </>
                 ) : (
                   <span className="text-orange-800">{improvement.replace(/'/g, '&apos;')}</span>
                 )}
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">💡</span>
          <h3 className="text-lg font-semibold text-blue-900">Suggestions</h3>
        </div>
                 <div className="text-blue-800 space-y-3">
           {feedback.suggestions.map((suggestion, index) => (
             <div key={index} className="flex items-start">
               <span className="text-blue-600 mr-2 mt-1">•</span>
               <div className="text-sm leading-relaxed">
                 {suggestion.split(':').length > 1 ? (
                   <>
                     <span className="font-semibold text-blue-900">{suggestion.split(':')[0]}:</span>
                     <span className="text-blue-800">{suggestion.split(':').slice(1).join(':')}</span>
                   </>
                 ) : (
                   <span className="text-blue-800">{suggestion.replace(/'/g, '&apos;')}</span>
                 )}
               </div>
             </div>
           ))}
         </div>
      </div>

             {/* Grade Explanation */}
       <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
         <div className="flex items-center mb-4">
           <span className="text-2xl mr-3">🏆</span>
           <h3 className="text-lg font-semibold text-gray-900">Final Grade</h3>
         </div>
         <p className="text-gray-700 text-sm leading-relaxed mb-4">{feedback.overall}</p>
         
         {/* Grade Scale */}
         <div className="border-t border-gray-200 pt-4">
           <h4 className="text-sm font-semibold text-gray-700 mb-3">Grade Scale:</h4>
           <div className="grid grid-cols-2 gap-2 text-xs">
             <div className="flex items-center">
               <span className="w-6 h-6 bg-green-100 text-green-800 border border-green-200 rounded-full flex items-center justify-center font-bold mr-2">A+</span>
               <span className="text-gray-600">Exceptional - World-class landing page</span>
             </div>
             <div className="flex items-center">
               <span className="w-6 h-6 bg-green-100 text-green-800 border border-green-200 rounded-full flex items-center justify-center font-bold mr-2">A</span>
               <span className="text-gray-600">Excellent - Highly effective</span>
             </div>
             <div className="flex items-center">
               <span className="w-6 h-6 bg-blue-100 text-blue-800 border border-blue-200 rounded-full flex items-center justify-center font-bold mr-2">B</span>
               <span className="text-gray-600">Good - Solid fundamentals</span>
             </div>
             <div className="flex items-center">
               <span className="w-6 h-6 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full flex items-center justify-center font-bold mr-2">C</span>
               <span className="text-gray-600">Average - Needs improvement</span>
             </div>
             <div className="flex items-center">
               <span className="w-6 h-6 bg-orange-100 text-orange-800 border border-orange-200 rounded-full flex items-center justify-center font-bold mr-2">D</span>
               <span className="text-gray-600">Poor - Significant issues</span>
             </div>
             <div className="flex items-center">
               <span className="w-6 h-6 bg-red-100 text-red-800 border border-red-200 rounded-full flex items-center justify-center font-bold mr-2">F</span>
               <span className="text-gray-600">Failing - Major problems</span>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
} 