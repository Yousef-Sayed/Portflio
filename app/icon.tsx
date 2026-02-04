import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 32, height: 32 };
export const contentType = "image/svg+xml";

export default function Icon() {
    return new ImageResponse(
        (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="none"
            >
                <g transform="translate(4, 4)">
                    <path
                        d="M2 20 L10 2"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary"
                    />
                    <path
                        d="M18 20 L10 2"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary"
                    />
                    <path
                        d="M10 10 L10 25"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary"
                    />
                    <circle
                        cx="10"
                        cy="28"
                        r="2"
                        fill="currentColor"
                        className="text-primary"
                    />
                </g>
            </svg>
        ),
        { ...size }
    );
}
