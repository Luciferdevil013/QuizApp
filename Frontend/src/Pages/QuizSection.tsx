
import React, { useState } from "react";

function QuizSection() {
  const [selectedOption, setSelectedOption] = useState("1");

  const options = [
    { id: "1", text: "Modi Chacha" },
    { id: "2", text: "Baba" },
    { id: "3", text: "Lalpu" },
    { id: "4", text: "Lalu Chacha" },
  ];

  return (
    <div className="w-10/12 h-full flex items-center justify-center">
      <div className="question-card w-2/5 h-fit bg-gray-500 rounded-lg p-4 flex flex-col gap-10">
        <h1 className="text-xl font-bold text-white">Who is President of India?</h1>
        <div className="option flex flex-col gap-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full h-fit flex items-center border-solid border-2 py-2 px-4 rounded-lg cursor-pointer 
                ${
                  selectedOption === option.id
                    ? "bg-black text-white border-red-500"
                    : "bg-white text-black"
                }`}
            >
              <h1 className="text-lg">{option.text}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizSection;
