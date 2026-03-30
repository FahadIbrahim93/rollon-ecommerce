export function isAdminLinkActive(currentPath: string, href: string): boolean {
  if (href === '/admin') {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}
