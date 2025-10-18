import LinkPageHeader from "./links/LinkPageHeader";

export default function Header() {
  return (
    <div className="bg-main-background">
      <div className="flex justify-between">
        <LinkPageHeader />
      </div>
    </div>
  );
};