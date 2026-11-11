import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import { fetchCharacterStatus } from "@/modules/character/characterStatus";

export async function resolvePlayerHome(): Promise<string> {
  const status = await fetchCharacterStatus();
  return status === "exists" ? CHARACTER_ROUTES.profile : CHARACTER_ROUTES.create;
}
