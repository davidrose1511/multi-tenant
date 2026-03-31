const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Path 1 */}
    <path
      d="M10.555 10.5551V14.5826C10.555 18.3737 7.48007 21.4452 3.6924 21.4452H0V10.5551H10.555Z"
      fill="url(#paint0_linear)"
    />
    {/* Path 2 */}
    <path
      d="M21.445 21.4451V32H10.5549V28.3076C10.5549 24.52 13.6264 21.4451 17.4175 21.4451H21.445Z"
      fill="url(#paint1_linear)"
    />
    {/* Path 3 */}
    <path
      d="M32 0V21.4451H21.445V10.555H10.5549V0H32Z"
      fill="url(#paint2_linear)"
    />
    {/* Gradient Definitions */}
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="10.5139"
        y1="10.5762"
        x2="-1.88041"
        y2="22.5891"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--gradient-start)" />
        <stop offset="1" stopColor="var(--gradient-end)" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="21.4027"
        y1="21.4656"
        x2="9.38981"
        y2="33.8599"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--gradient-start)" />
        <stop offset="1" stopColor="var(--gradient-end)" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1="31.9166"
        y1="0.0417194"
        x2="7.49748"
        y2="24.4608"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--gradient-start)" />
        <stop offset="1" stopColor="var(--gradient-end)" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
