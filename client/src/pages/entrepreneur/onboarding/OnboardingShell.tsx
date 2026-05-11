import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type OnboardingShellProps = {
  children: ReactNode;
  progress?: number;
  showBack?: boolean;
};

const OnboardingShell = ({
  children,
  progress = 0,
  showBack = false,
}: OnboardingShellProps) => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia text-black">
      <section className="flex min-h-screen w-full max-w-[430px] flex-col px-[50px] py-[78px]">
        {progress > 0 ? (
          <div className="mb-[30px] flex h-[10px] items-center gap-[22px]">
            {showBack ? (
              <button
                className="bg-transparent p-0"
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <img className="h-6 w-6" src="/icons/chevron-left.svg" alt="" />
              </button>
            ) : null}
            <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#f0e8e3]">
              <div
                className="h-full rounded-full bg-maroon"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        {children}
      </section>
    </main>
  );
};

export default OnboardingShell;
