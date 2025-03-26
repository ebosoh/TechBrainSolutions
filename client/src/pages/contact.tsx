import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="pt-20">
        <ContactSection />
      </div>
    </MainLayout>
  );
}