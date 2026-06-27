// src/components/property/ContactButton.tsx
"use client";

import { useState } from "react";
import ContactPopup from "./ContactPopup";

type Props = {
  propertyId: string;
  propertyName: string;
  // agentName: string;
  // agentPhone: string;
  // postedBy: string;
};

export default function ContactButton({
  propertyId,
  propertyName,
  // agentName,
  // agentPhone,
  // postedBy,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ContactPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        propertyId={propertyId}
        propertyName={propertyName}
        //   agentName={agentName}
        //   agentPhone={agentPhone}
        //   postedBy={postedBy}
      />
    </>
  );
}
