export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="150"
      height="50"
      viewBox="0 0 150 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ebffa3", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#45a049", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="150" height="50" rx="25" fill="url(#bgGradient)" />
      <circle cx="30" cy="25" r="15" fill="white" opacity="0.2" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="20"
      >
        Kenyantalents
      </text>
      {/* Remove or comment out the path element */}
      {/* <path d="M120 20 L125 25 L120 30" stroke="white" strokeWidth="2" /> */}
    </svg>
  );
}
