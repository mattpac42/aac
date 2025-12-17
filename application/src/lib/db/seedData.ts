import { dataService } from './dataService';
import type { Word, Category, WordType } from './schema';

/**
 * Seed Data Generator for Baseline Vocabulary
 *
 * WHY: Provides a comprehensive baseline vocabulary (139 words) for new app installations
 * REASON: Idempotent seeding ensures data integrity and prevents duplicate entries
 *
 * NOTE: All baseline data is marked with isDefault: true to distinguish from user-created content
 */

interface SeedResult {
  success: boolean;
  message: string;
  stats: {
    categories: number;
    words: number;
    skipped: boolean;
  };
}

interface BaselineWord {
  text: string;
  icon: string;
  type: WordType;
}

interface BaselineCategory {
  text: string;
  icon: string;
}

/**
 * Baseline category definitions
 * REASON: These map to the original app's category structure
 */
const BASELINE_CATEGORIES = [
  { name: 'Core Board', iconName: 'Grid3x3', order: 0 },
  { name: 'People', iconName: 'Users', order: 1 },
  { name: 'Food & Drink', iconName: 'Pizza', order: 2 },
  { name: 'Feelings', iconName: 'Heart', order: 3 },
  { name: 'Places', iconName: 'MapPin', order: 4 },
  { name: 'Activities', iconName: 'Zap', order: 5 },
  { name: 'Social Phrases', iconName: 'MessageCircle', order: 6 }
];

/**
 * Core Board Words (30 words)
 * WHY: High-frequency communication essentials for quick access
 */
const CORE_WORDS: BaselineWord[] = [
  // Row 1
  { text: 'I', icon: 'User', type: 'pronoun' },
  { text: 'want', icon: 'Hand', type: 'verb' },
  { text: 'more', icon: 'Plus', type: 'social' },
  { text: 'go', icon: 'ArrowRight', type: 'verb' },
  { text: 'stop', icon: 'StopCircle', type: 'verb' },

  // Row 2
  { text: 'help', icon: 'HelpCircle', type: 'verb' },
  { text: 'me', icon: 'UserCircle', type: 'pronoun' },
  { text: 'my', icon: 'Heart', type: 'pronoun' },
  { text: 'like', icon: 'ThumbsUp', type: 'verb' },
  { text: "don't", icon: 'X', type: 'social' },

  // Row 3
  { text: 'good', icon: 'Smile', type: 'descriptive' },
  { text: 'bad', icon: 'Frown', type: 'descriptive' },
  { text: 'yes', icon: 'Check', type: 'social' },
  { text: 'no', icon: 'Ban', type: 'social' },
  { text: 'play', icon: 'Gamepad2', type: 'verb' },

  // Row 4
  { text: 'eat', icon: 'Utensils', type: 'verb' },
  { text: 'drink', icon: 'Cup', type: 'verb' },
  { text: 'sleep', icon: 'Moon', type: 'verb' },
  { text: 'open', icon: 'FolderOpen', type: 'verb' },
  { text: 'close', icon: 'FolderClosed', type: 'verb' },

  // Row 5
  { text: 'turn', icon: 'RotateCw', type: 'verb' },
  { text: 'on', icon: 'Power', type: 'social' },
  { text: 'off', icon: 'PowerOff', type: 'social' },
  { text: 'up', icon: 'ArrowUp', type: 'social' },
  { text: 'down', icon: 'ArrowDown', type: 'social' },

  // Row 6
  { text: 'big', icon: 'Maximize2', type: 'descriptive' },
  { text: 'small', icon: 'Minimize2', type: 'descriptive' },
  { text: 'all done', icon: 'CheckCircle2', type: 'social' },
  { text: 'wait', icon: 'Timer', type: 'social' },
  { text: 'it', icon: 'Circle', type: 'pronoun' }
];

/**
 * People Category Words (15 words)
 */
const PEOPLE_WORDS: BaselineCategory[] = [
  { text: 'mom', icon: 'UserCircle' },
  { text: 'dad', icon: 'User' },
  { text: 'teacher', icon: 'GraduationCap' },
  { text: 'friend', icon: 'Users' },
  { text: 'brother', icon: 'User' },
  { text: 'sister', icon: 'UserCircle' },
  { text: 'grandma', icon: 'Heart' },
  { text: 'grandpa', icon: 'Heart' },
  { text: 'baby', icon: 'Baby' },
  { text: 'pet', icon: 'Dog' },
  { text: 'doctor', icon: 'Stethoscope' },
  { text: 'nurse', icon: 'Cross' },
  { text: 'family', icon: 'Home' },
  { text: 'child', icon: 'Baby' },
  { text: 'adult', icon: 'User' }
];

/**
 * Food & Drink Category Words (17 words)
 */
const FOOD_WORDS: BaselineCategory[] = [
  { text: 'water', icon: 'Droplet' },
  { text: 'juice', icon: 'Cup' },
  { text: 'milk', icon: 'Milk' },
  { text: 'apple', icon: 'Apple' },
  { text: 'banana', icon: 'Banana' },
  { text: 'cracker', icon: 'Cookie' },
  { text: 'cookie', icon: 'Cookie' },
  { text: 'sandwich', icon: 'Sandwich' },
  { text: 'cereal', icon: 'Bowl' },
  { text: 'pizza', icon: 'Pizza' },
  { text: 'bread', icon: 'Wheat' },
  { text: 'snack', icon: 'Package' },
  { text: 'lunch', icon: 'UtensilsCrossed' },
  { text: 'breakfast', icon: 'Sunrise' },
  { text: 'dinner', icon: 'Utensils' },
  { text: 'hungry', icon: 'UtensilsCrossed' },
  { text: 'thirsty', icon: 'Droplets' }
];

/**
 * Places Category Words (15 words)
 */
const PLACES_WORDS: BaselineCategory[] = [
  { text: 'home', icon: 'Home' },
  { text: 'school', icon: 'School' },
  { text: 'park', icon: 'Trees' },
  { text: 'store', icon: 'Store' },
  { text: 'bathroom', icon: 'Bath' },
  { text: 'car', icon: 'Car' },
  { text: 'outside', icon: 'Trees' },
  { text: 'bed', icon: 'Bed' },
  { text: 'kitchen', icon: 'ChefHat' },
  { text: 'bedroom', icon: 'BedDouble' },
  { text: 'playground', icon: 'Carousel' },
  { text: 'library', icon: 'Library' },
  { text: 'hospital', icon: 'Hospital' },
  { text: 'restaurant', icon: 'UtensilsCrossed' },
  { text: 'beach', icon: 'Waves' }
];

/**
 * Feelings Category Words (16 words)
 */
const FEELINGS_WORDS: BaselineCategory[] = [
  { text: 'happy', icon: 'Smile' },
  { text: 'sad', icon: 'Frown' },
  { text: 'mad', icon: 'Angry' },
  { text: 'tired', icon: 'Moon' },
  { text: 'scared', icon: 'Skull' },
  { text: 'sick', icon: 'Thermometer' },
  { text: 'excited', icon: 'PartyPopper' },
  { text: 'bored', icon: 'Meh' },
  { text: 'okay', icon: 'ThumbsUp' },
  { text: 'love', icon: 'HeartHandshake' },
  { text: 'worry', icon: 'AlertCircle' },
  { text: 'calm', icon: 'CloudSun' },
  { text: 'angry', icon: 'Angry' },
  { text: 'confused', icon: 'HelpCircle' },
  { text: 'proud', icon: 'Award' },
  { text: 'hurt', icon: 'Bandage' }
];

/**
 * Activities Category Words (17 words)
 */
const ACTIVITIES_WORDS: BaselineCategory[] = [
  { text: 'run', icon: 'PersonStanding' },
  { text: 'jump', icon: 'ArrowUp' },
  { text: 'walk', icon: 'Footprints' },
  { text: 'sit', icon: 'Armchair' },
  { text: 'dance', icon: 'Music' },
  { text: 'sing', icon: 'Mic2' },
  { text: 'play', icon: 'Gamepad2' },
  { text: 'read', icon: 'BookOpen' },
  { text: 'draw', icon: 'Pencil' },
  { text: 'wash', icon: 'Droplets' },
  { text: 'watch', icon: 'Eye' },
  { text: 'listen', icon: 'Ear' },
  { text: 'look', icon: 'Eye' },
  { text: 'write', icon: 'PenTool' },
  { text: 'color', icon: 'Palette' },
  { text: 'cut', icon: 'Scissors' },
  { text: 'build', icon: 'Boxes' }
];

/**
 * Social Phrases Category Words (29 words from School + Weather)
 * NOTE: Combining School and Weather categories into Social Phrases
 */
const SOCIAL_WORDS: BaselineCategory[] = [
  // School words (15)
  { text: 'book', icon: 'Book' },
  { text: 'pencil', icon: 'Pencil' },
  { text: 'paper', icon: 'FileText' },
  { text: 'teacher', icon: 'GraduationCap' },
  { text: 'friend', icon: 'Users' },
  { text: 'computer', icon: 'Monitor' },
  { text: 'desk', icon: 'Box' },
  { text: 'backpack', icon: 'Backpack' },
  { text: 'crayon', icon: 'Palette' },
  { text: 'scissors', icon: 'Scissors' },
  { text: 'glue', icon: 'Droplet' },
  { text: 'class', icon: 'School' },
  { text: 'homework', icon: 'FileEdit' },
  { text: 'lesson', icon: 'BookMarked' },
  { text: 'recess', icon: 'PlayCircle' },
  // Weather words (14)
  { text: 'sun', icon: 'Sun' },
  { text: 'rain', icon: 'CloudRain' },
  { text: 'hot', icon: 'Flame' },
  { text: 'cold', icon: 'Snowflake' },
  { text: 'cloudy', icon: 'Cloud' },
  { text: 'windy', icon: 'Wind' },
  { text: 'snow', icon: 'Snowflake' },
  { text: 'storm', icon: 'CloudLightning' },
  { text: 'sunny', icon: 'Sun' },
  { text: 'warm', icon: 'Thermometer' },
  { text: 'cool', icon: 'AirVent' },
  { text: 'foggy', icon: 'CloudFog' },
  { text: 'clear', icon: 'CloudSun' },
  { text: 'rainbow', icon: 'Rainbow' }
];

/**
 * Check if database has already been seeded
 * WHY: Prevents duplicate seeding and maintains idempotency
 */
async function isDatabaseSeeded(): Promise<boolean> {
  const metadata = await dataService.getMetadata();
  const categories = await dataService.getAllCategories();

  // Check if we have any default categories
  return categories.some(cat => cat.isDefault === true);
}

/**
 * Seed the database with baseline vocabulary
 *
 * REASON: Creates initial data structure for new app installations
 * NOTE: Function is idempotent - safe to call multiple times
 */
export async function seedDatabase(): Promise<SeedResult> {
  try {
    // Check if already seeded
    if (await isDatabaseSeeded()) {
      return {
        success: true,
        message: 'Database already seeded, skipping',
        stats: {
          categories: 0,
          words: 0,
          skipped: true
        }
      };
    }

    // Create categories
    const categoryMap = new Map<string, string>();

    for (const categoryDef of BASELINE_CATEGORIES) {
      const category = await dataService.createCategory({
        name: categoryDef.name,
        iconName: categoryDef.iconName,
        order: categoryDef.order,
        isDefault: true
      });

      categoryMap.set(categoryDef.name, category.id);
    }

    let wordCount = 0;

    // Create Core Board words
    const coreId = categoryMap.get('Core Board')!;
    for (let i = 0; i < CORE_WORDS.length; i++) {
      const word = CORE_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: word.type,
        categoryId: coreId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create People words
    const peopleId = categoryMap.get('People')!;
    for (let i = 0; i < PEOPLE_WORDS.length; i++) {
      const word = PEOPLE_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'noun',
        categoryId: peopleId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create Food & Drink words
    const foodId = categoryMap.get('Food & Drink')!;
    for (let i = 0; i < FOOD_WORDS.length; i++) {
      const word = FOOD_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'noun',
        categoryId: foodId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create Places words
    const placesId = categoryMap.get('Places')!;
    for (let i = 0; i < PLACES_WORDS.length; i++) {
      const word = PLACES_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'noun',
        categoryId: placesId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create Feelings words
    const feelingsId = categoryMap.get('Feelings')!;
    for (let i = 0; i < FEELINGS_WORDS.length; i++) {
      const word = FEELINGS_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'descriptive',
        categoryId: feelingsId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create Activities words
    const activitiesId = categoryMap.get('Activities')!;
    for (let i = 0; i < ACTIVITIES_WORDS.length; i++) {
      const word = ACTIVITIES_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'verb',
        categoryId: activitiesId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Create Social Phrases words
    const socialId = categoryMap.get('Social Phrases')!;
    for (let i = 0; i < SOCIAL_WORDS.length; i++) {
      const word = SOCIAL_WORDS[i];
      await dataService.createWord({
        text: word.text,
        type: 'noun',
        categoryId: socialId,
        iconName: word.icon,
        order: i,
        isDefault: true
      });
      wordCount++;
    }

    // Initialize settings (will use defaults from dataService)
    await dataService.getSettings();

    // Update metadata with statistics
    await dataService.updateMetadata({
      statistics: {
        totalWords: wordCount,
        customWords: 0,
        totalCategories: BASELINE_CATEGORIES.length,
        customCategories: 0,
        customImages: 0,
        storageUsedMB: 0
      }
    });

    return {
      success: true,
      message: `Database seeded successfully with ${wordCount} words and ${BASELINE_CATEGORIES.length} categories`,
      stats: {
        categories: BASELINE_CATEGORIES.length,
        words: wordCount,
        skipped: false
      }
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: `Failed to seed database: ${(error as Error).message}`,
      stats: {
        categories: 0,
        words: 0,
        skipped: false
      }
    };
  }
}
