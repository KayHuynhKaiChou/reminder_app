import { createContext, useContext } from 'react';

type BottomSheetContextType = {
  handleBackScreenBefore?: () => void;
  handleCloseBottomSheet?: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

export const BottomSheetProvider = BottomSheetContext.Provider;
