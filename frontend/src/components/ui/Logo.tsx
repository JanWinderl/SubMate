/**
 * SubMate Logo Component
 * Modern SVG logo with shield + subscription symbols
 */
interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className = "", size = 48 }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Gradient for modern look */}
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>

            {/* Shield base */}
            <path
                d="M50 10 L80 25 L80 50 Q80 70 50 90 Q20 70 20 50 L20 25 Z"
                fill="url(#logoGradient)"
                opacity="0.9"
            />

            {/* Circular refresh/subscription symbol */}
            <g transform="translate(50, 50)">
                {/* Circle arrow (recurring payment symbol) */}
                <path
                    d="M -15 -5 A 15 15 0 1 1 -15 5"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Arrow head */}
                <path
                    d="M -15 -5 L -20 -10 M -15 -5 L -10 -10"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Dollar/Euro symbol in center */}
                <text
                    x="0"
                    y="8"
                    textAnchor="middle"
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                >
                    €
                </text>
            </g>

            {/* Checkmark overlay (subscription under control) */}
            <path
                d="M 35 48 L 45 58 L 65 35"
                stroke="white"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
            />
        </svg>
    );
}
