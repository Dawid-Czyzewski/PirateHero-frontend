# ADR 001: czysty SQL (bez ORM)

## Kontekst

Freak Legends (Next.js) potrzebuje lokalnej bazy pod auth i dalszy backend.
Chcemy prostego, czytelnego dostępu do danych bez ciężkiego stacku ORM
(Prisma, Drizzle, TypeORM itd.), żeby migracje i zapytania były jawne
i łatwe do audytu.

## Decyzja

- **Postgres lokalnie** (Windows: usługa `postgresql-x64-18`, port `5432`).
- **Czysty SQL** wykonywany przez bibliotekę **`pg`**.
- **Bez ORM** i bez generatorów schematu — schemat w plikach `db/*.sql`,
  połączenie przez `DATABASE_URL` w `.env.local` (niecommitowane).

## Konsekwencje

- Plus: pełna kontrola nad SQL, mało zależności, proste skrypty (`db-check`, migracje).
- Plus: ten sam silnik co w innych lokalnych projektach (np. ClickDrop).
- Minus: brak automatycznego mapowania typów / migracji „z kodu” — SQL piszemy ręcznie.
- Minus: trzeba dbać o parametryzację zapytań (`$1`, `$2`…) przeciw SQL injection.

## Baza lokalna

| | |
|---|---|
| Silnik | PostgreSQL 18 (Windows service `postgresql-x64-18`) |
| Host | `127.0.0.1:5432` |
| Baza aplikacji | `freak_legends` |
| Połączenie | `DATABASE_URL` w `.env.local` |
| Sprawdzenie | `node scripts/db-check.mjs` → `DB OK: 1` |
| Uruchomienie | usługa Windows (nie Docker); Docker Desktop w tym środowisku nie jest wymagany |
