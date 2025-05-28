import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AdvocatesTable from "./AdvocatesTable";
import { act } from "react";
import { formatPhone } from "@/app/utils";

beforeEach(() => {
  jest.resetAllMocks();
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

    act(
      () =>
        ((global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        }))
    );

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
    // Mock initial and search fetch calls
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<AdvocatesTable />);

    // Wait for initial load
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    // Mock the input change and submit
    const input = screen.getByPlaceholderText("Search Advocates...");
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Verify correct search query
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("q=John"));
    });
  });
});
