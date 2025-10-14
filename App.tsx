import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { EditorCanvas } from './components/EditorCanvas';
import { EditingTools } from './components/EditingTools';
import { SuggestionBox } from './components/SuggestionBox';
import { HistoryPanel } from './components/HistoryPanel';
import { useImageEditing } from './hooks/useImageEditing';
import { useTranslation } from './hooks/useTranslation';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { t } = useTranslation();
  
  const { 
    state, 
    loadImage, 
    applyEdit, 
    undo, 
    redo, 
    reset, 
    downloadImage, 
    getSuggestions,
    addTextOverlay,
    updateTextOverlay,
    selectTextOverlay,
    deleteSelectedTextOverlay,
    flattenTextOverlays,
    // Brush functions
    toggleBrushMode,
    setBrushSize,
    updateBrushMask,
    clearBrushMask,
  } = useImageEditing(t);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const toggleDarkMode = useCallback(() => {
      setIsDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    if(state.originalImage) {
      getSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.originalImage]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="p-4 lg:p-8">
        {!state.originalImage ? (
          <ImageUploader onImageUpload={loadImage} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 xl:col-span-2 space-y-6">
              <EditingTools 
                onApplyEdit={applyEdit} 
                onUndo={undo} 
                onRedo={redo} 
                onReset={reset}
                onDownload={downloadImage}
                canUndo={state.historyIndex > 0}
                canRedo={state.historyIndex < state.history.length - 1}
                isLoading={state.isLoading}
                // Text overlay props
                onAddText={addTextOverlay}
                onUpdateText={updateTextOverlay}
                onDeleteText={deleteSelectedTextOverlay}
                onApplyText={flattenTextOverlays}
                textOverlays={state.textOverlays}
                selectedTextId={state.selectedTextId}
                // Brush props
                isBrushModeActive={state.isBrushModeActive}
                brushSize={state.brushSize}
                hasMask={!!state.brushMask}
                onToggleBrushMode={toggleBrushMode}
                onSetBrushSize={setBrushSize}
                onClearBrushMask={clearBrushMask}
              />
              <HistoryPanel 
                history={state.history} 
                currentIndex={state.historyIndex} 
              />
            </div>

            <div className="lg:col-span-6 xl:col-span-8">
              <EditorCanvas 
                image={state.currentImage} 
                isLoading={state.isLoading}
                loadingMessage={state.loadingMessage}
                error={state.error}
                // Text overlay props
                textOverlays={state.textOverlays}
                selectedTextId={state.selectedTextId}
                onSelectText={selectTextOverlay}
                onUpdateText={updateTextOverlay}
                // Brush props
                isBrushModeActive={state.isBrushModeActive}
                brushSize={state.brushSize}
                brushMask={state.brushMask}
                onUpdateBrushMask={updateBrushMask}
              />
            </div>

            <div className="lg:col-span-3 xl:col-span-2">
              <SuggestionBox
                suggestions={state.suggestions}
                onApplySuggestion={applyEdit}
                isLoading={state.isSuggesting}
                onRefresh={getSuggestions}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;