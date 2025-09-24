import { useEffect, useState } from "react";

import { Input, Label } from "@/components/ui";
import { useDebounce } from "@/hooks/common";

interface FilterBarProps {
  maxPageSize: number;
  onSearch: (searchTerm: string) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  currentSearch: string;
}

export const FilterBar = ({
  maxPageSize,
  onSearch,
  onPageSizeChange,
  currentPageSize,
  currentSearch,
}: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [pageSizeInput, setPageSizeInput] = useState(
    currentPageSize.toString()
  );

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, currentSearch]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setPageSizeInput(currentPageSize.toString());
  }, [currentPageSize]);

  const handlePageSizeChange = (value: string) => {
    setPageSizeInput(value);
    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxPageSize) {
      onPageSizeChange(numValue);
    }
  };

  const handlePageSizeBlur = () => {
    const numValue = parseInt(pageSizeInput);

    if (isNaN(numValue) || numValue < 1) {
      setPageSizeInput("1");
      onPageSizeChange(1);
    } else if (numValue > maxPageSize) {
      setPageSizeInput(maxPageSize.toString());
      onPageSizeChange(maxPageSize);
    }
  };

  return (
    <div className="flex p-5 rounded-2xl mx-5 justify-start gap-x-4">
      <Label htmlFor="search">
        Buscar:
        <Input
          id="search"
          className="justify-start w-fit mx-2"
          placeholder="Buscar productos..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </Label>
      <Label htmlFor="productsPerPage">
        Productos por página:{" "}
        <Input
          id="productsPerPage"
          className="justify-start w-fit"
          placeholder="1"
          type="number"
          min={1}
          max={maxPageSize}
          value={pageSizeInput}
          onChange={e => handlePageSizeChange(e.target.value)}
          onBlur={handlePageSizeBlur}
          disabled={maxPageSize === 0}
        />
      </Label>
    </div>
  );
};
