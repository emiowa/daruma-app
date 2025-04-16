import Image from "next/image";
import LinkPaginasHeader from "./links/LinkPaginasHeader";

export default function Header() {
  return (
    <div className="p-4 bg-main-background">
      <div className="flex justify-between">
        <Image
          src="/images/daruma.png"
          alt="daruma-icon"
          width={200}
          height={60}
        />
        <LinkPaginasHeader />
      </div>
    </div>
  );
};