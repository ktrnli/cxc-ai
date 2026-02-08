import svgPaths from "./svg-hv1hisoatu";
import imgKatsfavicon1 from "figma:asset/32780c1222698aa66400a44011bd08773b06c85a.png";
import imgVhsVertical from "figma:asset/a93e158ffb43269b996fca21c5f2601565964428.png";

function Background({ className }: { className?: string }) {
  return (
    <div className={className || "absolute h-[1405.105px] left-[-23px] top-[-130px] w-[1444px]"} data-name="Background">
      <div className="absolute inset-[0_0_58.44%_69.18%]" data-name="Eclipse">
        <div className="absolute inset-[-34.25%_-44.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 845 984">
            <g filter="url(#filter0_f_1_40)" id="Eclipse">
              <ellipse cx="422.5" cy="492" fill="url(#paint0_linear_1_40)" rx="222.5" ry="292" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="984" id="filter0_f_1_40" width="845" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_1_40" stdDeviation="100" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_40" x1="422.5" x2="422.5" y1="200" y2="784">
                <stop stopColor="#D8C2FF" stopOpacity="0" />
                <stop offset="1" stopColor="#5915B3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute bg-gradient-to-b blur-[100px] from-[rgba(24,75,255,0)] inset-[41.56%_83.17%_30.11%_0] to-[#c8b6ff]" />
      <div className="absolute flex inset-[53.66%_48.4%_0_3.39%] items-center justify-center">
        <div className="flex-none h-[573px] rotate-[107.09deg] w-[505px]">
          <div className="relative size-full">
            <div className="absolute inset-[-34.9%_-39.6%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 905 973">
                <g filter="url(#filter0_f_1_38)" id="Vector 7">
                  <path d={svgPaths.p2a9cc700} fill="url(#paint0_linear_1_38)" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="973" id="filter0_f_1_38" width="905" x="1.26719e-06" y="-1.60769e-06">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_38" stdDeviation="100" />
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_38" x1="156.418" x2="599.224" y1="200.273" y2="691.737">
                    <stop stopColor="#575EFF" />
                    <stop offset="1" stopColor="#FFCDF8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[44.91%_39.94%_15.52%_18.01%] items-center justify-center">
        <div className="flex-none h-[566.944px] rotate-[85.26deg] w-[510.974px]">
          <div className="relative size-full">
            <div className="absolute inset-[-35.28%_-39.14%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 910.974 966.944">
                <g filter="url(#filter0_f_1_36)" id="Vector 8">
                  <path d={svgPaths.p3b7b0600} fill="url(#paint0_linear_1_36)" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="966.944" id="filter0_f_1_36" width="910.974" x="1.32773e-06" y="-9.19178e-07">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_36" stdDeviation="100" />
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_36" x1="155.902" x2="592.902" y1="200.271" y2="696.271">
                    <stop stopColor="#575EFF" />
                    <stop offset="1" stopColor="#E478FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <div className={className || "absolute h-[87px] left-[106px] top-[54px] w-[704px]"} data-name="Logo">
      <div className="absolute aspect-[320/320] left-0 right-[92.9%] top-[19px]" data-name="katsfavicon 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgKatsfavicon1} />
      </div>
      <div className="absolute flex flex-col font-['Inter:Bold_Italic',sans-serif] font-bold inset-[0_0_0_9.52%] italic justify-center leading-[0] text-[36px] text-white">
        <p className="leading-[normal] whitespace-pre-wrap">maestro.</p>
      </div>
    </div>
  );
}

function StartButton({ className }: { className?: string }) {
  return (
    <div className={className || "absolute h-[68px] left-[106px] top-[183px] w-[305px]"} data-name="Start Button">
      <div className="absolute bg-[rgba(0,0,0,0)] border-2 border-[#c8b6ff] border-solid inset-0 rounded-[200px]" />
      <div className="absolute flex flex-col font-['Inter:Semi_Bold_Italic',sans-serif] font-semibold inset-[14.71%_22.95%] italic justify-center leading-[0] text-[#e4dbff] text-[24px]">
        <p className="leading-[normal] whitespace-pre-wrap">Start Practice</p>
      </div>
    </div>
  );
}

function UploadButton({ className }: { className?: string }) {
  return (
    <div className={className || "absolute h-[68px] left-[431px] top-[183px] w-[305px]"} data-name="Upload Button">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[68px] rotate-180 w-[305px]">
          <div className="bg-[rgba(0,0,0,0)] border-2 border-[#c8b6ff] border-solid rounded-[200px] size-full" />
        </div>
      </div>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold_Italic',sans-serif] font-semibold inset-[14.71%_11.15%] italic justify-center leading-[0] text-[#e4dbff] text-[24px]">
        <p className="leading-[normal] whitespace-pre-wrap">Upload Sheet Music</p>
      </div>
    </div>
  );
}

export default function MacBookAirHomeScreen() {
  return (
    <div className="bg-[#2e2733] relative size-full" data-name="MacBook Air - Home Screen">
      <Background />
      <Logo />
      <div className="absolute h-[757px] left-[793px] shadow-[5px_10px_17px_0px_rgba(0,0,0,0.4)] top-[50px] w-[429px]" data-name="VHS Vertical">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[125.49%] left-[-31.3%] max-w-none top-[-14.91%] w-[284.48%]" src={imgVhsVertical} />
        </div>
      </div>
      <div className="absolute flex h-[500.404px] items-center justify-center left-[66px] top-[292px] w-[714.128px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[89.4deg]">
          <div className="h-[709px] relative shadow-[10px_5px_17px_0px_rgba(0,0,0,0.4)] w-[493px]" data-name="VHS Horizontal">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[122.65%] left-[-101.55%] max-w-none top-[-11.59%] w-[226.77%]" src={imgVhsVertical} />
            </div>
          </div>
        </div>
      </div>
      <StartButton />
      <UploadButton />
    </div>
  );
}