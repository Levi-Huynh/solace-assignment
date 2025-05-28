"use client";

import { CellChips, Pagination, SearchBox } from "@/app/components";
import { Column, Table } from "@/app/components/Table";
import { useCallback, useEffect, useState } from "react";

import { Advocate } from "@/db/schema";
import { formatPhone } from "@/app/utils";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function AdvocatesTable() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;
  const debounced = useDebounce(searchTerm);

  const fetchData = useCallback(
    async (offset: number, search: string) => {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        q: search || "",
      });

      try {
        const res = await fetch(`/api/advocates?${params.toString()}`);
        const { data } = await res.json();
        setAdvocates(data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
        setAdvocates([]);
      } finally {
        setLoading(false);
      }
    },

    [limit],
  );

  // Fetch advocates on initial load
  useEffect(() => {
    fetchData(0, "");
  }, []);

  // Debounce searchTerm changes
  useEffect(() => {
    setOffset(0);
    fetchData(0, debounced);
  }, [debounced, fetchData]);

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const onPageChange = useCallback(
    (direction: "prev" | "next") => {
      let newOffset = direction === "prev" ? Math.max(offset - limit, 0) : offset + limit;

      setOffset(newOffset);
      fetchData(newOffset, debounced);
    },
    [offset, limit, debounced, fetchData],
  );

  return (
    <section className="max7xl-layout">
      <SearchBox onSearch={onSearch} searchTerm={searchTerm} placeholder="Search Advocates..." />

      <Table<Advocate>
        columns={columns}
        rows={(advocates || []).map((a) => ({ id: a.id, data: a }))}
      />
      {!loading && advocates.length === 0 && <div>No rows Found</div>}

      <Pagination
        offset={offset}
        limit={limit}
        total={advocates.length}
        onPageChange={onPageChange}
      />
    </section>
  );
}

const columns: Column<Advocate>[] = [
  {
    header: "Name",
    key: "firstName",
    render: (row, key) => <td key={key}>{`${row.firstName} ${row.lastName}`}</td>,
  },
  { header: "City", key: "city", className: "hide-mobile" },
  { header: "Degree", key: "degree", className: "hide-mobile" },
  {
    header: "Specialties",
    key: "specialties",
    className: "text-center",
    render: (row, key) => <CellChips key={key} items={row.specialties} />,
  },
  { header: "Years of Experience", key: "yearsOfExperience", className: "hide-mobile text-center" },
  {
    header: "Phone",
    key: "phoneNumber",
    render: (row, key) => <td key={key}>{formatPhone(row.phoneNumber)}</td>,
  },
];
