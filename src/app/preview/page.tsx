import { Suspense } from "react";
import PreviewContent from "./PreviewContent";

const PreviewPage = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PreviewContent />
    </Suspense>
  );
};

export default PreviewPage;
