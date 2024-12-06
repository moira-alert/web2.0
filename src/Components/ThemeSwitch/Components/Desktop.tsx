import React from "react";

export const Desktop = ({ color, size }: { color: string; size: number }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            <path
                d="M22.688 4.75H4.313C3.588 4.75 3 5.339 3 6.063v12.25c0 .723.589 1.312 1.313 1.312h7.437v.942l-4.884.814a.438.438 0 00.143.863l5.213-.869h2.555l5.213.869a.435.435 0 00.503-.36.437.437 0 00-.36-.503l-4.883-.814v-.942h7.438c.723 0 1.312-.589 1.312-1.313V6.063c0-.723-.589-1.312-1.313-1.312zM14.374 20.5h-1.75v-.875h1.75v.875zm8.75-2.188a.438.438 0 01-.438.438H4.313a.438.438 0 01-.437-.438V6.063c0-.241.196-.437.438-.437h18.375c.241 0 .437.196.437.438v12.25z"
                className="n-icon__fill"
                fillRule="evenodd"
                fill={color}
            />
        </svg>
    );
};
