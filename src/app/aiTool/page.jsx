"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { aiOutputGenerator } from "@/app/APIRequest/ai";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  aiToolPrompt,
  loadingAI,
  textAiOutput,
} from "../redux/features/aiToolSlice";

const Page = () => {
  const selector = useAppSelector((store) => store.aiSlice);
  const dispatch = useAppDispatch();

  async function generateAiOutput() {
    try {
      dispatch(loadingAI(true));
      const output = await aiOutputGenerator(selector.aiToolPrompt);
      console.log(output);
      if (output && output.data && output.data.output) {
        dispatch(textAiOutput(`${selector.textAiOutput}<split>${output.data.output}`));
      } else {
        dispatch(textAiOutput(`Something went wrong or check your network`));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(loadingAI(false));
    }
  }

  const renderOutput = (output, idx) => {
    const codeBlockRegex = /```(.*?)```/gs;
    const parts = output.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const [language, ...codeLines] = part.split("\n");
        const code = codeLines.join("\n").trim();
        return (
          <div key={`${idx}-${index}`} className="mb-4">
            <SyntaxHighlighter language={language} style={dark}>
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return (
          <p
            key={`${idx}-${index}`}
            className="mb-4 text-left whitespace-pre-wrap"
          >
            {part}
          </p>
        );
      }
    });
  };

  return (
    <>
      <div className="min-h-screen text-center mb-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 pt-24 flex flex-col items-center">
        <div className="bg-white shadow-lg rounded-md p-6 w-full max-w-3xl">
          <div className="overflow-y-auto min-h-96">
            {selector.textAiOutput
              .split("<split>")
              .map((e, idx) => renderOutput(e, idx))}
          </div>
          <div className="mt-4 flex justify-between w-full">
            <input
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              type="text"
              onChange={(e) => dispatch(aiToolPrompt(e.target.value))}
            />
            {selector.loadingAI ? (
              <div
                role="status"
                className="ml-2 bg-blue-500 text-white py-1 px-3 rounded block auto pl-2 pr-2"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <button
                onClick={generateAiOutput}
                className="ml-4 bg-blue-500 text-white rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-600"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
