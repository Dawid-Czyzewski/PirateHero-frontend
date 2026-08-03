export default function FameCoinIcon({ className = "w-5 h-5", strokeWidth = 2.5 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#FFD700"
        stroke="#FF6B35"
        strokeWidth={strokeWidth}
      />
      {}
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="#FFA500"
        stroke="#FFD700"
        strokeWidth={strokeWidth * 0.6}
      />
      {}
      <path
        d="M12 4 L13.09 8.26 L17.71 8.26 L14.31 10.98 L15.4 15.24 L12 12.52 L8.6 15.24 L9.69 10.98 L6.29 8.26 L10.91 8.26 Z"
        fill="#FF6B35"
        stroke="#FFD700"
        strokeWidth={strokeWidth * 0.4}
      />
      {}
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="#FFD700"
      />
    </svg>
  );
}

