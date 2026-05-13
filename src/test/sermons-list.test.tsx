import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    Link: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => <a {...rest}>{children}</a>,
    useLocation: () => ({ pathname: "/sermons" }),
  };
});

import { useList } from "@/services/queries";

function SermonsHarness() {
  const { data = [], isLoading } = useList("sermons");
  if (isLoading) return <div>Loading…</div>;
  return (
    <ul>
      {data.map((s) => <li key={s.id}>{s.title}</li>)}
    </ul>
  );
}

describe("public sermons listing", () => {
  it("renders seeded sermons from MSW", async () => {
    renderWithProviders(<SermonsHarness />);
    await waitFor(() => {
      expect(screen.getByText("The Weight of Grace")).toBeInTheDocument();
    });
    expect(screen.getByText("Rooted in the Word")).toBeInTheDocument();
  });
});
