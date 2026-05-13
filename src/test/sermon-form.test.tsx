import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import { setToken } from "@/services/api";
import { SermonForm } from "@/components/admin/SermonForm";

// Mock router navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => () => {},
    Link: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => <a {...rest}>{children}</a>,
  };
});

import { vi } from "vitest";

describe("SermonForm", () => {
  it("shows validation errors for empty submit", async () => {
    setToken("mock-admin-token-abc123");
    renderWithProviders(<SermonForm mode="new" />);
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/title/i));
    await user.clear(screen.getByLabelText(/thumbnail url/i));
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/must be a valid url/i)).toBeInTheDocument();
  });

  it("auto-derives slug from title", async () => {
    setToken("mock-admin-token-abc123");
    renderWithProviders(<SermonForm mode="new" />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^title$/i), "A New Hope");
    await waitFor(() => {
      expect((screen.getByLabelText(/slug/i) as HTMLInputElement).value).toBe("a-new-hope");
    });
  });
});
