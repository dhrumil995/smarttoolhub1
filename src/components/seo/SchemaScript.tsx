import React from 'react';

export interface SchemaScriptProps {
  schema: Record<string, any> | null;
}

export const SchemaScript: React.FC<SchemaScriptProps> = ({ schema }) => {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
