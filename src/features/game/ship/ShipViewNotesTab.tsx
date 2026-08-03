import { useEffect, useState } from 'react';
import type { TFunction } from 'i18next';
import type { ShipData } from '@/features/game/ship/shipTypes';
import { Button, Textarea } from '@/features/game/ship/ShipUi';

type Props = {
  ship: ShipData;
  isCaptain: boolean;
  onDescriptionSave: (description: string) => void | Promise<void>;
  onInternalNotesChange: (notes: string) => void | Promise<void>;
  t: TFunction;
};

export function ShipViewNotesTab({
  ship,
  isCaptain,
  onDescriptionSave,
  onInternalNotesChange,
  t,
}: Props) {
  const [descEditing, setDescEditing] = useState(false);
  const [descDraft, setDescDraft] = useState(ship.description);
  const [notesEditing, setNotesEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState(ship.internalNotes);

  useEffect(() => {
    setDescDraft(ship.description);
  }, [ship.description]);

  useEffect(() => {
    setNotesDraft(ship.internalNotes);
  }, [ship.internalNotes]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {String(t('shipPage.shipDescriptionSectionTitle'))}
          </h2>
          {isCaptain && !descEditing ? (
            <Button type="button" size="sm" variant="outline" onClick={() => setDescEditing(true)}>
              {String(t('shipPage.editButton'))}
            </Button>
          ) : null}
        </div>
        {isCaptain && descEditing ? (
          <div className="space-y-2">
            <Textarea
              className="min-h-[6rem] resize-y text-sm"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              placeholder={String(t('shipPage.shipDescriptionPlaceholder'))}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  void onDescriptionSave(descDraft.trim());
                  setDescEditing(false);
                }}
              >
                {String(t('shipPage.saveButton'))}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setDescDraft(ship.description);
                  setDescEditing(false);
                }}
              >
                {String(t('shipPage.cancelEditButton'))}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-muted/50 p-3 text-sm text-foreground">
            {ship.description.trim() ? (
              <p className="whitespace-pre-wrap">{ship.description}</p>
            ) : (
              <p className="text-muted-foreground">{String(t('shipPage.emptyShipDescription'))}</p>
            )}
          </div>
        )}
      </div>
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {String(t('internalNotes'))}
          </h2>
          {isCaptain && !notesEditing ? (
            <Button type="button" size="sm" variant="outline" onClick={() => setNotesEditing(true)}>
              {String(t('shipPage.editButton'))}
            </Button>
          ) : null}
        </div>
        {isCaptain && notesEditing ? (
          <div className="space-y-2">
            <Textarea
              className="min-h-[10rem] resize-y text-sm"
              placeholder={String(t('internalNotesPlaceholder'))}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  void onInternalNotesChange(notesDraft);
                  setNotesEditing(false);
                }}
              >
                {String(t('shipPage.saveButton'))}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setNotesDraft(ship.internalNotes);
                  setNotesEditing(false);
                }}
              >
                {String(t('shipPage.cancelEditButton'))}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-muted/50 p-3 text-sm text-foreground">
            {ship.internalNotes.trim() ? (
              <p className="whitespace-pre-wrap">{ship.internalNotes}</p>
            ) : (
              <p className="text-muted-foreground">{String(t('internalNotesPlaceholder'))}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
