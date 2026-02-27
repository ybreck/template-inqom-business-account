import React from 'react';

// Icon definitions have been moved from this file.
// Please use src/constants/icons.tsx for shared icons.
// Module-specific icons are located in their respective module's 'icons.tsx' file.

// Mock data (mockClientInvoices, mockConversations) and utility functions (getPDPStatusBadgeStyle, formatMessageTimestamp)
// that were previously here and causing type import errors have been removed.
// This data and these utilities are correctly homed within their respective modules
// (e.g., src/modules/clientInvoices/data.ts, src/modules/conversations/data.ts, etc.)
// and should not be duplicated or incorrectly imported in this global constants file.
// This change resolves the TypeScript errors related to missing type exports from 'src/types.ts'.

// If there were any truly global constants (not data or type-specific utils), they would remain here.
// For now, this file is effectively empty of specific constants after the cleanup.