import { describe, it, expect, vi, beforeEach } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import handler from "@/pages/api/banks/bank_names";
import connection from "@/lib/mysql";

// Mock the MySQL connection
vi.mock("@/lib/mysql", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("POST /api/banks/bank_names", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 🚫 Wrong method test
  it("should return 405 for non-POST requests", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });

        expect(res.status).toBe(405);
        expect(await res.text()).toContain("Method GET Not Allowed");
      },
    });
  });

  // ✅ 200 Success test
  it("should return bank list when results exist", async () => {
    const mockRows = [
      { bank_name: "Access Bank", bank_code: "044" },
      { bank_name: "Access Bank Corp", bank_code: "145" },
    ];

    (connection.query as any).mockResolvedValue([mockRows]);

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({ message: "Access" }),
          headers: { "Content-Type": "application/json" },
        });

        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.message).toEqual([
          "1. Access Bank 044",
          "2. Access Bank Corp 145",
        ]);

        expect(connection.query).toHaveBeenCalledWith(
          "SELECT * FROM banks WHERE name LIKE ?",
          ["Access%"]
        );
      },
    });
  });

  // ❌ 404 Not Found test
  it("should return 404 when no banks match", async () => {
    (connection.query as any).mockResolvedValue([[]]);

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({ message: "Unknown" }),
          headers: { "Content-Type": "application/json" },
        });

        expect(res.status).toBe(404);

        const data = await res.json();
        expect(data.message).toBe("Bank not found. Try again");
      },
    });
  });

  // 💥 500 server error test
  it("should return 500 on database error", async () => {
    (connection.query as any).mockRejectedValue(new Error("DB error"));

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({ message: "Access" }),
          headers: { "Content-Type": "application/json" },
        });

        expect(res.status).toBe(500);
        expect(await res.text()).toBe("Server error");
      },
    });
  });
});
