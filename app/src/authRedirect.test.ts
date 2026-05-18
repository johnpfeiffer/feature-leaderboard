import { describe, expect, it } from "vitest";
import { getAuthRedirectUrl } from "./authRedirect";

describe("auth redirect URL", () => {
  it.each([
    {
      href: "http://localhost:5173/",
      expected: "http://localhost:5173/",
    },
    {
      href: "https://feneky.com/feature-leaderboard/",
      expected: "https://feneky.com/feature-leaderboard/",
    },
    {
      href: "https://feneky.com/feature-leaderboard/#access_token=token",
      expected: "https://feneky.com/feature-leaderboard/",
    },
    {
      href: "https://feneky.com/feature-leaderboard/?preview=true#access_token=token",
      expected: "https://feneky.com/feature-leaderboard/",
    },
  ])("uses the current app path for $href", ({ href, expected }) => {
    expect(getAuthRedirectUrl({ href } as Location)).toBe(expected);
  });
});

