"use client";
import { useState } from "react";

/*
  Create a search bar component in typescript that takes in a search term and a callback function
*/

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Implement next js api fetch function
  const fetchResult = async (searchTerm: string) => {
    setSearchResults("");
    setIsSearching(true);
    // implement fetch function
    const res = await fetch(`/api?query=${searchTerm}`);
    const data = await res.json();
    setIsSearching(false);
    setSearchResults(data.text);
  };

  const handleEnterKey = async (e: any) => {
    if (e.key === "Enter") {
      fetchResult(searchTerm);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {/* Implement search bar. Place it in the center of the screen. */}
      <div className="flex flex-col items-center justify-center">
        {/* implement an inline text input and button  */}
        <div className="flex flex-row items-center justify-center">
          <input
            className="border border-gray-400 rounded-md p-2 mr-2 w-96"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>
      </div>
      {isSearching && (
        <div className="flex flex-col items-center justify-center mt-8">
          <p className="text-xl animate-pulse">Loading...</p>
        </div>
      )}
      {searchResults && (
        <div className="flex flex-col items-center justify-center mt-8">
          <p className="border border-gray-400 rounded-md p-2">
            {searchResults}
          </p>
        </div>
      )}
    </main>
  );
}
