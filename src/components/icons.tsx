import type { SVGProps } from 'react';

export function Icons({
  ...props
}: SVGProps<SVGSVGElement> & {
  name: 'hope';
}) {
  switch (props.name) {
    case 'hope':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <title>HOPE Logo</title>
          <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
          <path d="M12 8v8" />
          <path d="M9 12h6" />
        </svg>
      );
  }
}
