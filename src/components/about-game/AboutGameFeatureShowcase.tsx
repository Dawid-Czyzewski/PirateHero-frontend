import { useTranslation } from 'react-i18next';
import arenaBattle from '@/assets/arena-battle.jpg';
import dungeonScene from '@/assets/dungeon-scene.jpg';
import rpgCharacter from '@/assets/rpg-character.jpg';
import { Map, Flame, Star, Gem, Trophy, Dumbbell } from 'lucide-react';
import { SECTION_WRAP } from '@/components/about-game/aboutGameTypes';

export function AboutGameFeatureShowcase() {
  const { t } = useTranslation();
  const characterBullets = t('aboutPage.characterBullets', { returnObjects: true }) as string[];
  const arenaBullets = t('aboutPage.arenaBullets', { returnObjects: true }) as string[];
  const dungeonBullets = t('aboutPage.dungeonBullets', { returnObjects: true }) as string[];

  return (
    <section className="py-5 md:py-10" aria-labelledby="about-features-heading">
      <h2 id="about-features-heading" className="sr-only">
        {t('aboutPage.featuresSectionSrOnly')}
      </h2>
      <div className={`${SECTION_WRAP} space-y-8 md:space-y-14 lg:space-y-24`}>
        <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-10 md:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <Dumbbell className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <h3 className="font-display text-2xl font-bold text-foreground">
                {t('aboutPage.characterTitle')}
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-foreground/80">{t('aboutPage.characterBody')}</p>
            <ul className="space-y-2 text-muted-foreground">
              {characterBullets.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <Star className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <img
              src={rpgCharacter}
              alt={t('aboutPage.imgCharacterAlt')}
              className="w-full rounded-lg border border-border shadow-lg shadow-primary/10"
              loading="lazy"
              width={800}
              height={512}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-4 md:gap-8 lg:gap-10 md:flex-row">
          <div className="flex-1">
            <img
              src={arenaBattle}
              alt={t('aboutPage.imgArenaAlt')}
              className="w-full rounded-lg border border-border shadow-lg shadow-primary/10"
              loading="lazy"
              width={800}
              height={512}
            />
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <Trophy className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <h3 className="font-display text-2xl font-bold text-foreground">
                {t('aboutPage.arenaTitle')}
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-foreground/80">{t('aboutPage.arenaBody')}</p>
            <ul className="space-y-2 text-muted-foreground">
              {arenaBullets.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <Flame className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-10 md:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <Map className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <h3 className="font-display text-2xl font-bold text-foreground">
                {t('aboutPage.dungeonTitle')}
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-foreground/80">{t('aboutPage.dungeonBody')}</p>
            <ul className="space-y-2 text-muted-foreground">
              {dungeonBullets.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <Gem className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <img
              src={dungeonScene}
              alt={t('aboutPage.imgDungeonAlt')}
              className="w-full rounded-lg border border-border shadow-lg shadow-primary/10"
              loading="lazy"
              width={800}
              height={512}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
