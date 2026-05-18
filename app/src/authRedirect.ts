export function getAuthRedirectUrl(location: Pick<Location, "href">): string {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

