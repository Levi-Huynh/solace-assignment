import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AdvocatesTable from "./AdvocatesTable";
import { act } from "react";
import { formatPhone } from "@/app/utils";

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe("AdvocatesTable", () => {
  it("fetches advocates and renders", async () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          city: "Seattle",
          degree: "JD",
          specialties: ["Family Law", "Criminal Law"],
          yearsOfExperience: 10,
          phoneNumber: "2065551234",
        },
      ],
    };

    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<AdvocatesTable />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Verify correct table rows
    expect(screen.getByText("Seattle")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("Family Law")).toBeInTheDocument();
    expect(screen.getByText(formatPhone(2065551234))).toBeInTheDocument();
  });

  it("correctly requests a search query", async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<AdvocatesTable />);

    const input = screen.getByPlaceholderText("Search Advocates...");
    fireEvent.change(input, { target: { value: "John" } });
    // Advance timers to flush the 300ms debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now the debounced fetch should fire with q=John
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("q=John"));
    });
  });
});
