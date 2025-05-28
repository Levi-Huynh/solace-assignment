import { Undo2 } from "lucide-react";

type SearchBoxProps = {
  onSearch: (query: string) => void;
  searchTerm: string;
  placeholder?: string;
};

export default function SearchBox({
  onSearch,
  searchTerm,
  placeholder = "Searching...",
}: SearchBoxProps) {
  return (
    <div className="single-row">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="input"
      />
      <div className="hide-mobile">
        <button className="btn-primary" onClick={() => onSearch("")}>
          <Undo2 /> Clear Search
        </button>
      </div>
    </div>
  );
}
