const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col w-full md:max-w-[calc(100vw-5.75rem)] font-poppins">
      {children}
    </div>
  );
};

export default MainContent;
