"use client";

import { useState } from "react";

type CellChipsProp = {
  items: string[];
  limit?: number;
};

export function CellChips({ items, limit = 1 }: CellChipsProp) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, limit);

  return (
    <td className="td-chips">
      <div className="wrap-columns">
        {displayItems.map((item) => (
          <span key={item} className="cell-chip">
            <CellTitle title={item} />
          </span>
        ))}

        {
          <button onClick={() => setShowAll(!showAll)} className="btn-link">
            {items.length === 1 ? null : !showAll ? <span>view all</span> : <span>view less</span>}
          </button>
        }
      </div>
    </td>
  );
}

export function CellTitle({ title, limitChar = 15 }: { title: string; limitChar?: number }) {
  if (title.length > limitChar) {
    return (
      <span title={title} className="text-gray-500">
        {title.slice(0, 15)}...
      </span>
    );
  }
  return <span className="text-gray-500">{title}</span>;
}
