import { useAuth } from "@/hooks/useAuth";

import ListBody from "./LIstBody";

export default function List() {
  const { uid } = useAuth();

  return (
    <article className="flex flex-col gap-6 h-full px-40 py-14">
      <ListBody uid={uid} />
    </article>
  );
}
