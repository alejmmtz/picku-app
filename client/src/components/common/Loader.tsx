interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Loading..." }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-30">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange/20 border-t-orange" />
      <p className="mt-3 text-[14px] font-light text-[#7A716D]">{message}</p>
    </div>
  );
};

export default Loader;