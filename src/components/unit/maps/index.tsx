import MapsClient from "./client";
import MapsContent from "./content";

import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Maps() {
  const [keyword, setKeyword] = useState("");
  console.log("keyword: ", keyword);

  return (
    // prettier-ignore
    <>
      <Suspense fallback={<div><Loader2/></div>}>
        <MapsClient setKeyword={setKeyword} />
      </Suspense>
      <MapsContent keyword={keyword} />
    </>
  );
}
