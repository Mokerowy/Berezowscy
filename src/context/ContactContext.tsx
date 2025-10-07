import React, { createContext, useContext } from "react";

import type { ReactNode } from "react";

interface ContactData {
  adres: string;
  adresUrl: string;
  telefon: string;
  telefonUrl: string;
  email: string;
  emailUrl: string;
}

const DEFAULT_CONTACT_DATA: ContactData = {
  adres: "ul. Kozarzewek 1, 62-530 Kazimierz Biskupi",
  adresUrl:
    "https://www.google.com/maps/search/?api=1&query=ul.+Kozarzewek+1,+62-530+Kazimierz+Biskupi",
  telefon: "608 386 245",
  telefonUrl: "tel:+48608386245",
  email: "berezowskiz@wp.pl",
  emailUrl: "mailto:berezowskiz@wp.pl",
};

const ContactContext = createContext<ContactData>(DEFAULT_CONTACT_DATA);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ContactContext.Provider value={DEFAULT_CONTACT_DATA}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
