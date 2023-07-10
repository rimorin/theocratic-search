"use client";
import { useEffect, useState } from "react";
import {
  CHAT_TYPE,
  DEFAULT_INPUT_PLACEHOLDER,
  DEFAULT_NOTIFICATION_TIMEOUT,
} from "./constants";
import { Chat } from "./interface";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);

  const Chat = ({ message, type }: Chat) => {
    if (type === CHAT_TYPE.ANSWER) {
      return (
        <li className="flex gap-x-2 sm:gap-x-4">
          <div className="grow bg-white border border-gray-200 rounded-lg p-4 space-y-3 dark:bg-slate-900 dark:border-gray-700">
            <div className="space-y-1.5">
              <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                {message}
              </p>
            </div>
            <div>
              <div className="sm:flex sm:justify-between">
                <div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(message);
                      setShowNotification(true);
                      setTimeout(() => {
                        setShowNotification(false);
                      }, DEFAULT_NOTIFICATION_TIMEOUT);
                    }}
                    type="button"
                    className="py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-sm dark:hover:bg-slate-800 dark:hover:text-gray-400 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                    Copy
                  </button>
                  {navigator.share && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.share({
                          title: "Theocratic Search",
                          text: message,
                        });
                      }}
                      className="py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-sm dark:hover:bg-slate-800 dark:hover:text-gray-400 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                      </svg>
                      Share
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li className="max-w-2xl ml-auto flex justify-end gap-x-2 sm:gap-x-4">
        <div className="grow text-end space-y-3">
          <div className="inline-block bg-blue-600 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-white">{message}</p>
          </div>
        </div>
      </li>
    );
  };

  // fetch result via POST request
  const fetchResult = async (searchTerm: string) => {
    // return;
    if (searchTerm === "") return;
    setIsSearching(true);
    const response = await fetch(`/api`, {
      method: "POST",
      body: JSON.stringify({ question: searchTerm, chats: chats }),
    });
    const data = await response.json();
    setIsSearching(false);
    setChats((chats) => [
      ...chats,
      { message: data.text.trim(), type: CHAT_TYPE.ANSWER },
    ]);
  };

  // useEffect to trigger a scroll to bottom on chat history change
  useEffect(() => {
    const conversationDiv = document.getElementById("conversation");
    if (conversationDiv) {
      // scroll div to bottom
      conversationDiv.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }

    // empty text input
    setSearchTerm("");

    // blur search input
    document.getElementById("search-input")?.blur();
  }, [chats]);

  return (
    <>
      {showNotification && (
        <div
          className="bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 absolute top-10 left-1/2 -translate-x-1/2 z-20"
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

      <div className="flex flex-col justify-between h-screen">
        <div className="max-w-screen-xl px-4 pt-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-4xl md:leading-tight font-bold text-gray-900 sm:text-3xl dark:text-white">
                Theocratic Search
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-white">
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
                <span className="text-sm font-medium dark:text-white">
                  Learn More
                </span>

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
        <div
          id="conversation"
          className="overflow-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8 lg:py-14 h-full
          "
        >
          {chats && (
            <ul className="mt-8 space-y-5">
              {chats.map((chat, index) => (
                <Chat key={index} message={chat.message} type={chat.type} />
              ))}
              {isSearching && (
                <li className="flex gap-x-2 sm:gap-x-4">
                  <div className="inline bg-white border border-gray-200 rounded-lg p-4 space-y-3 dark:bg-slate-900 dark:border-gray-700">
                    <p className="inline-flex mb-1.5 text-sm text-gray-800 dark:text-white">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8v2a6 6 0 0 0-6 6z"
                        ></path>
                      </svg>
                      <span className="pl-2">Searching ...</span>
                    </p>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-slate-900 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <textarea
                id="search-input"
                disabled={isSearching}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                rows={5}
                className="p-4 pb-12 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 z-10"
                placeholder={DEFAULT_INPUT_PLACEHOLDER}
              ></textarea>
              <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <div className="mt-1 sm:mt-0 flex items-center">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      disabled={isSearching}
                      className="py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-sm dark:hover:bg-slate-800 dark:hover:text-gray-400 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                    >
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                      </svg>
                      Restart Chat
                    </button>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <button
                      // on click fetch result and set chats
                      onClick={() => {
                        setChats([
                          ...chats,
                          {
                            message: searchTerm,
                            type: CHAT_TYPE.QUESTION,
                          },
                        ]);
                        fetchResult(searchTerm);
                      }}
                      type="button"
                      className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {isSearching ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v2a6 6 0 0 0-6 6z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
