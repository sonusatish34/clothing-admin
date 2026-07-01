import type { ReactNode } from 'react';

declare const Layout: (props: {
  Content?: ReactNode;
  children?: ReactNode;
}) => JSX.Element;

export default Layout;
