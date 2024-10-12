const SmallLink = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-orange-300">
      {children}
    </div>
  );
};

export default SmallLink;
