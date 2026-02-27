
export const formatMessageTimestamp = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
         date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};