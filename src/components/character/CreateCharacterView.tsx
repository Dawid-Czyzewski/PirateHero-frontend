"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { CharacterCreator } from "@/components/character/CharacterCreator";

export function CreateCharacterView() {
  return <RequireAuth>{(user) => <CharacterCreator nick={user.nick} />}</RequireAuth>;
}
