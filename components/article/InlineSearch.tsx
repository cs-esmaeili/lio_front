"use client";

import { useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import { useClickOutside } from "@/hooks/useClickOutside";

const InlineSearch = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    loading,
    clearSearch,
  } = useSearch("article");

  //  بستن با کلیک بیرون (مثل ضربدر)
  useClickOutside(wrapperRef, () => {
    clearSearch();
  });

  return (
    <div ref={wrapperRef} className="bg-primary-3 rounded-lg relative h-full min-h-12 flex align-middle">
      <SearchInput
        value={query}
        onChange={setQuery}
        onClear={clearSearch}
      />

      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg z-50">
          <SearchResults
            items={results}
            query={query}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default InlineSearch;