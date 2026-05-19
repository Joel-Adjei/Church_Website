import logo from "@/assets/logo.avif";

const PageLoad = () => {
  return (
    <div className="h-dvh w-full z-40 bg-background fixed top-0 flex items-center animate-out justify-center">
      <img src={logo} className="object-contain size-40  animate-pulse" />
    </div>
  );
};

export default PageLoad;
