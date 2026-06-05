interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Loading..." }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-full items-center justify-center mb-8">
        <img
          className="block h-auto w-40"
          src="/resources/img-1-onboarding.svg"
          alt="Ilustración de inicio de sesión"
        />
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange/20 border-t-orange" />
      <p className="mt-2 text-sm font-light text-black/60">{message}</p>
    </div>
  );
};

export default Loader;
