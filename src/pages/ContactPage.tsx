import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/modal/Modal';
import { usePageMeta } from '@/hooks/usePageMeta';
import ContactHeader from '@/components/contact/ContactHeader';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import type { ContactFormSubmitPayload } from '@/components/contact/ContactForm';

export default function ContactPage() {
  const { t } = useTranslation();
  usePageMeta({
    title: t('contact.seoTitle'),
    description: t('contact.seoDescription'),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const handleFormSubmit = (result: ContactFormSubmitPayload) => {
    if (result.success) {
      setModalMessage(result.message);
      setModalType('success');
      setIsModalOpen(true);
    } else {
      setModalMessage(result.message || t('contact.errorMessage'));
      setModalType('error');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-8 md:py-10 lg:max-w-6xl">
        <div
          className="rounded-2xl border border-border bg-muted/25 p-6 shadow-sm sm:p-8 md:p-10"
          aria-labelledby="contact-page-heading"
        >
          <ContactHeader />
          <ContactForm onSubmit={handleFormSubmit} />
          <ContactInfo />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'success' ? t('contact.successTitle') : t('contact.errorTitle')}
        type={modalType}
      >
        <p className="text-foreground">{modalMessage}</p>
      </Modal>
    </div>
  );
}
