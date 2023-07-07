const Logo = () => {
    return (
        <svg width="80" height="59" viewBox="0 0 80 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" width="64" height="42" rx="4" fill="#FFEA9F" />
            <rect y="4" width="64" height="42" rx="4" fill="#9FBAFF" />
            <g filter="url(#filter0_d_2_391)">
                <rect x="10" y="9" width="64" height="42" rx="2" fill="#62E6B6" />
            </g>
            <path d="M17 18H64" stroke="#A8FFE0" stroke-width="5" stroke-linecap="round" />
            <path d="M17 30H45" stroke="#A8FFE0" stroke-width="5" stroke-linecap="round" />
            <path d="M17 42H55" stroke="#A8FFE0" stroke-width="5" stroke-linecap="round" />
            <defs>
                <filter id="filter0_d_2_391" x="4" y="5" width="76" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.354271 0 0 0 0 0.745833 0 0 0 0 0.60535 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_391" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_391" result="shape" />
                </filter>
            </defs>
        </svg>

    )
}

export default Logo