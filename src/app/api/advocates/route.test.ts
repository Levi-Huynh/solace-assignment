import { limitDefault, offsetDefault } from "../utils";

import { GET } from "./route";
import { advocates } from "@/db/schema";
import db from "@/db";

// Mock the db, with db.select() as jest fn()
jest.mock("@/db", () => {
  const selectMock = jest.fn();
  return {
    __esModule: true,
    default: { select: selectMock },
  };
});

// Helper util for the request
function makeRequest(qs = "") {
  return new Request(`http://localhost:3000/api/advocates${qs}`);
}

describe("GET/api/advocates", () => {
  let qb: {
    from: jest.Mock<any, any>;
    where: jest.Mock<any, any>;
    limit: jest.Mock<any, any>;
    offset: jest.Mock<any, any>;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a stubbed query chain mocking our db builder
    qb = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockResolvedValue([{ id: 1, firstName: "Jane", lastName: "Doe" }]),
    };

    // Configure our db.select() to return the stub
    (db.select as jest.Mock).mockReturnValue(qb);
  });

  it("uses default limit & offset when none set by request", async () => {
    const res = await GET(makeRequest());
    const body = await res.json();

    expect(db.select).toHaveBeenCalled();
    expect(qb.from).toHaveBeenCalledWith(advocates);
    expect(qb.limit).toHaveBeenCalledWith(parseInt(limitDefault));
    expect(qb.offset).toHaveBeenCalledWith(parseInt(offsetDefault));
    expect(qb.where).toHaveBeenCalled();
    expect(body).toEqual({
      data: [{ id: 1, firstName: "Jane", lastName: "Doe" }],
    });
  });

  it("applies custom limit, offset & search query", async () => {
    const qs = "?limit=3&offset=7&q=foo+bar";
    const res = await GET(makeRequest(qs));
    const body = await res.json();

    expect(qb.limit).toHaveBeenCalledWith(3);
    expect(qb.offset).toHaveBeenCalledWith(7);
    expect(qb.where).toHaveBeenCalled();
    expect(body).toEqual({
      data: [{ id: 1, firstName: "Jane", lastName: "Doe" }],
    });
  });
});
