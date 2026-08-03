export default function GoldCoinIcon({ className = "w-5 h-5", strokeWidth = 2.5 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#FFD700"
        stroke="#FFA500"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="#FFED4E"
        stroke="#FFD700"
        strokeWidth={strokeWidth * 0.6}
      />
      <path
        d="M12 6 L12 18 M6 12 L18 12"
        stroke="#FFA500"
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="#FFA500"
      />
    </svg>
  );
}

