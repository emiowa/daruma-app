import { VocabularyProvider } from "@/app/context/VocabularyContext";

export default function VocabularyLayout({ children }) {
  return (
    <VocabularyProvider>
      {children}
    </VocabularyProvider>
  );
}