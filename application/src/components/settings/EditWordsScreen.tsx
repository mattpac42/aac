import { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageUploader } from '../ImageUploader';
import * as LucideIcons from 'lucide-react';
import type { Word, CategoryWord } from '../../App';
import type { WordTypeColors } from './ColorThemeScreen';

const iconOptions = [
  'User', 'Hand', 'Plus', 'ArrowRight', 'StopCircle', 'HelpCircle', 'Heart',
  'Smile', 'Frown', 'ThumbsUp', 'X', 'Check', 'Ban', 'Gamepad2', 'Utensils',
  'Cup', 'Moon', 'Power', 'Home', 'School', 'Pizza', 'MapPin', 'Cloud',
  'Sun', 'Star', 'Music', 'Book', 'Pencil', 'Camera', 'Phone', 'Mail',
  'Apple', 'Baby', 'Dog', 'Droplet', 'Trees', 'Store', 'Angry', 'PartyPopper'
];

interface EditWordsScreenProps {
  coreWords: Word[];
  categoryWords: Record<string, CategoryWord[]>;
  wordTypeColors?: WordTypeColors;
  onUpdateCoreWords: (words: Word[]) => void;
  onUpdateCategoryWords: (words: Record<string, CategoryWord[]>) => void;
  onBack: () => void;
}

export function EditWordsScreen({ coreWords, categoryWords, wordTypeColors, onUpdateCoreWords, onUpdateCategoryWords, onBack }: EditWordsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCoreWord, setEditingCoreWord] = useState<Word | null>(null);
  const [editingCategoryWord, setEditingCategoryWord] = useState<{ word: CategoryWord; category: string } | null>(null);
  const [isCoreDialogOpen, setIsCoreDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('People');

  // Core word dialog state
  const [wordText, setWordText] = useState('');
  const [wordIcon, setWordIcon] = useState('User');
  const [wordType, setWordType] = useState<'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social'>('noun');
  const [customImage, setCustomImage] = useState<string | undefined>(undefined);

  // Category word dialog state
  const [categoryWordText, setCategoryWordText] = useState('');
  const [categoryWordIcon, setCategoryWordIcon] = useState('User');
  const [customCategoryImage, setCustomCategoryImage] = useState<string | undefined>(undefined);

  const categories = ['People', 'Food', 'Places', 'Feelings', 'Actions', 'School', 'Weather'];

  // Core word functions
  const handleAddCoreWord = () => {
    setEditingCoreWord(null);
    setWordText('');
    setWordIcon('User');
    setWordType('noun');
    setCustomImage(undefined);
    setIsCoreDialogOpen(true);
  };

  const handleEditCoreWord = (word: Word) => {
    setEditingCoreWord(word);
    setWordText(word.text);
    setWordIcon(word.icon);
    setWordType(word.type);
    setCustomImage(undefined); // NOTE: Will be populated when Word type includes customImageUrl
    setIsCoreDialogOpen(true);
  };

  const handleSaveCoreWord = () => {
    const newWord: Word = { text: wordText, icon: wordIcon, type: wordType };
    
    if (editingCoreWord) {
      onUpdateCoreWords(coreWords.map(w => w === editingCoreWord ? newWord : w));
    } else {
      onUpdateCoreWords([...coreWords, newWord]);
    }
    
    setIsCoreDialogOpen(false);
    setEditingCoreWord(null);
  };

  const handleDeleteCoreWord = (word: Word) => {
    if (confirm(`Are you sure you want to delete "${word.text}"?`)) {
      onUpdateCoreWords(coreWords.filter(w => w !== word));
    }
  };

  // Category word functions
  const handleAddCategoryWord = (category: string) => {
    setEditingCategoryWord(null);
    setSelectedCategory(category);
    setCategoryWordText('');
    setCategoryWordIcon('User');
    setCustomCategoryImage(undefined);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategoryWord = (word: CategoryWord, category: string) => {
    setEditingCategoryWord({ word, category });
    setSelectedCategory(category);
    setCategoryWordText(word.text);
    setCategoryWordIcon(word.icon);
    setCustomCategoryImage(undefined); // NOTE: Will be populated when CategoryWord type includes customImageUrl
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategoryWord = () => {
    const newWord: CategoryWord = { text: categoryWordText, icon: categoryWordIcon };
    const updatedCategoryWords = { ...categoryWords };
    
    if (editingCategoryWord) {
      updatedCategoryWords[selectedCategory] = categoryWords[selectedCategory].map(w => 
        w === editingCategoryWord.word ? newWord : w
      );
    } else {
      updatedCategoryWords[selectedCategory] = [...(categoryWords[selectedCategory] || []), newWord];
    }
    
    onUpdateCategoryWords(updatedCategoryWords);
    setIsCategoryDialogOpen(false);
    setEditingCategoryWord(null);
  };

  const handleDeleteCategoryWord = (word: CategoryWord, category: string) => {
    if (confirm(`Are you sure you want to delete "${word.text}"?`)) {
      const updatedCategoryWords = { ...categoryWords };
      updatedCategoryWords[category] = categoryWords[category].filter(w => w !== word);
      onUpdateCategoryWords(updatedCategoryWords);
    }
  };

  const filteredCoreWords = coreWords.filter(word =>
    word.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategoryWords = (category: string) => {
    return (categoryWords[category] || []).filter(word =>
      word.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-slate-700">Edit Words</h1>
            <p className="text-slate-600">Manage vocabulary on your board and in categories</p>
          </div>
        </div>
      </div>

      {/* Core Word Edit Dialog */}
      <Dialog open={isCoreDialogOpen} onOpenChange={setIsCoreDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCoreWord ? 'Edit Core Word' : 'Add New Core Word'}</DialogTitle>
            <DialogDescription>
              {editingCoreWord ? 'Make changes to the selected word.' : 'Add a new word to your core board.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Word Text</Label>
              <Input
                value={wordText}
                onChange={(e) => setWordText(e.target.value)}
                placeholder="Enter word..."
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={wordIcon} onValueChange={setWordIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {iconOptions.map(icon => {
                      const IconComponent = (LucideIcons as any)[icon];
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span>{icon}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Word Type (Color)</Label>
              <Select value={wordType} onValueChange={(value) => setWordType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pronoun">Pronoun</SelectItem>
                  <SelectItem value="verb">Verb</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="noun">Noun</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Image (Optional)</Label>
              <ImageUploader
                onImageSelect={(base64) => setCustomImage(base64)}
                currentImage={customImage}
                maxSizeKB={500}
                aspectRatio={1}
              />
              <p className="text-xs text-slate-500">Upload a custom image for this word button</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsCoreDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveCoreWord} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingCoreWord ? 'Save Changes' : 'Add Word'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Word Edit Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategoryWord ? 'Edit Category Word' : `Add Word to ${selectedCategory}`}</DialogTitle>
            <DialogDescription>
              {editingCategoryWord ? 'Make changes to the selected word.' : `Add a new word to the ${selectedCategory} category.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Word Text</Label>
              <Input
                value={categoryWordText}
                onChange={(e) => setCategoryWordText(e.target.value)}
                placeholder="Enter word..."
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={categoryWordIcon} onValueChange={setCategoryWordIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {iconOptions.map(icon => {
                      const IconComponent = (LucideIcons as any)[icon];
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span>{icon}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Image (Optional)</Label>
              <ImageUploader
                onImageSelect={(base64) => setCustomCategoryImage(base64)}
                currentImage={customCategoryImage}
                maxSizeKB={500}
                aspectRatio={1}
              />
              <p className="text-xs text-slate-500">Upload a custom image for this word button</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsCategoryDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveCategoryWord} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingCategoryWord ? 'Save Changes' : 'Add Word'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search words..."
          className="pl-10"
        />
      </div>

      {/* Tabs for Core and Category Words */}
      <Tabs defaultValue="core" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="core">Core Board</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>

        {/* Core Words Tab */}
        <TabsContent value="core" className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Total words: <span className="text-slate-800">{coreWords.length}</span>
            </p>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 rounded-xl"
              onClick={handleAddCoreWord}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Core Word
            </Button>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredCoreWords.map((word, index) => {
                const IconComponent = (LucideIcons as any)[word.icon];
                const colors = wordTypeColors?.[word.type] || { bg: 'bg-yellow-200', border: 'border-yellow-400' };

                return (
                  <Card key={index} className={`p-4 ${colors.bg} ${colors.border} border-2`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        {IconComponent && <IconComponent className="h-8 w-8 text-slate-700" />}
                        <div>
                          <p className="text-slate-800">{word.text}</p>
                          <p className="text-slate-600">{word.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCoreWord(word)}
                          className="bg-white"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCoreWord(word)}
                          className="bg-white text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Category Words Tabs */}
        {categories.map(category => (
          <TabsContent key={category} value={category} className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                Total words in {category}: <span className="text-slate-800">{categoryWords[category]?.length || 0}</span>
              </p>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 rounded-xl"
                onClick={() => handleAddCategoryWord(category)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Word to {category}
              </Button>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredCategoryWords(category).map((word, index) => {
                  const IconComponent = (LucideIcons as any)[word.icon];
                  const colors = wordTypeColors?.noun || { bg: 'bg-orange-200', border: 'border-orange-400' };

                  return (
                    <Card key={index} className={`p-4 ${colors.bg} ${colors.border} border-2`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {IconComponent && <IconComponent className="h-8 w-8 text-slate-700" />}
                          <div>
                            <p className="text-slate-800">{word.text}</p>
                            <p className="text-slate-600">{category}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCategoryWord(word, category)}
                            className="bg-white"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategoryWord(word, category)}
                            className="bg-white text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}