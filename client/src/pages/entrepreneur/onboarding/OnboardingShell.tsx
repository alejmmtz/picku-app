import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../../assets/arrow.svg?react";

const TRACK_COLOR = "rgba(80, 3, 17, 0.14)";
const FILL_COLOR = "#500311";

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
  const progressValue = Math.min(Math.max(progress, 0), 100);
  const showProgress = progress > 0;

  return (
    <main className="app-shell">
      <section className="app-screen flex max-h-screen flex-col overflow-hidden justify-center items-center">
        {showProgress ? (
          <header className="z-10 mb-8 flex w-full shrink-0 items-center gap-4 bg-background">
            {showBack ? (
              <button
                className="flex shrink-0 items-center justify-center"
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowIcon className="h-4 w-4 shrink-0" />
              </button>
            ) : (
              <span aria-hidden className="shrink-0" />
            )}

            <div
              className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full"
              style={{ backgroundColor: TRACK_COLOR }}
              role="progressbar"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Onboarding progress"
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${progressValue}%`,
                  backgroundColor: FILL_COLOR,
                }}
              />
            </div>
          </header>
        ) : null}

        <div className="flex min-h-0 w-full flex-1 flex-col ">{children}</div>
      </section>
    </main>
  );
};

export default OnboardingShell;
