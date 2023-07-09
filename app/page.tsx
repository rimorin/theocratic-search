"use client";
import { useState } from "react";

const DEFAULT_NOTIFICATION_TIMEOUT = 3000;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const fetchResult = async (searchTerm: string) => {
    if (searchTerm === "") return;
    setSearchResults("");
    setIsSearching(true);
    const response = await fetch(`/api?query=${searchTerm}`);
    const data = await response.json();
    setIsSearching(false);
    setSearchResults(data.text.trim());
  };

  const handleEnterKey = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchResult(searchTerm);
    }
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    fetchResult(searchTerm);
  };

  return (
    <>
      <header>
        {showNotification && (
          <div
            className="bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 absolute bottom-5 left-1/2 -translate-x-1/2"
            role="alert"
          >
            <div className="flex p-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 text-blue-500 mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-700 dark:text-gray-400">
                  Copied to clipboard!
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Theocratic Search
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                A new way to search for answers 🔍
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
                onClick={() =>
                  window.open(
                    "https://github.com/rimorin/theocratic-search",
                    "_blank"
                  )
                }
              >
                <span className="text-sm font-medium">Learn More</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <form className="mx-auto mb-0 mt-8 space-y-4">
          <div>
            <label
              htmlFor="hs-trailing-button-add-on-with-icon"
              className="sr-only"
            >
              Label
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Ask me a question ..."
                name="hs-trailing-button-add-on-with-icon"
                className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-l-md dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:z-10 focus:ring-0 focus:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleEnterKey}
                disabled={isSearching}
              />
              <button
                type="button"
                className="-ml-px py-3 px-4 inline-flex justify-center items-center gap-2 border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchTerm("");
                  document
                    .getElementsByName("hs-trailing-button-add-on-with-icon")[0]
                    .focus();
                }}
                disabled={isSearching}
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center h-[3.125rem] w-[2.875rem] rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onClick={handleClick}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span
                    className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </span>
                ) : (
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {searchResults && (
            <div className="items-center relative">
              <label className="sr-only" htmlFor="answer">
                Answer
              </label>
              <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ">
                <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                  <textarea
                    className="w-full px-0 text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                    disabled
                    rows={10}
                    id="message"
                    value={searchResults}
                    style={{ resize: "none" }}
                  ></textarea>
                </div>
                <div className="text-end px-3 py-2 border-t dark:border-gray-600">
                  <div className="pl-0 space-x-1 sm:pl-2">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      onClick={async () => {
                        await navigator.clipboard.writeText(searchResults);
                        setShowNotification(true);
                        setTimeout(() => {
                          setShowNotification(false);
                        }, DEFAULT_NOTIFICATION_TIMEOUT);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z" />
                        <path d="M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z" />
                      </svg>
                      <span className="sr-only">Copy</span>
                    </button>
                    {navigator.share && (
                      <button
                        type="button"
                        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => {
                          navigator.share({
                            title: searchTerm,
                            text: searchResults,
                          });
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 18"
                        >
                          <path d="M14.419 10.581a3.564 3.564 0 0 0-2.574 1.1l-4.756-2.49a3.54 3.54 0 0 0 .072-.71 3.55 3.55 0 0 0-.043-.428L11.67 6.1a3.56 3.56 0 1 0-.831-2.265c.006.143.02.286.043.428L6.33 6.218a3.573 3.573 0 1 0-.175 4.743l4.756 2.491a3.58 3.58 0 1 0 3.508-2.871Z" />
                        </svg>
                        <span className="sr-only">Share</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
