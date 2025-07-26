import Image from "next/image";
import LinkPaginasHeader from "./links/LinkPaginasHeader";

export default function Header() {
  return (
    <div className="bg-main-background">
      <div className="flex justify-between">
        <LinkPaginasHeader />
      </div>
    </div>
  );
};