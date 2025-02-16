// Hebrew investigation steps for different difficulty levels
export const hebrewInvestigations = {
  easy: [
    "התבונן בגרף וזהה את סוג הפונקציה",
    "מצא את נקודות החיתוך עם הצירים מתוך הגרף",
    "קבע האם הפונקציה עולה או יורדת לפי הגרף",
    "זהה את התחומים שבהם הפונקציה חיובית/שלילית מתוך הגרף",
    "רשום את הביטוי האלגברי של הפונקציה"
  ],
  medium: [
    "התבונן בגרף וזהה את סוג הפונקציה",
    "מצא את נקודות החיתוך עם הצירים מתוך הגרף",
    "קבע את שיפוע הפונקציה מתוך הגרף",
    "זהה את התחומים שבהם הפונקציה חיובית/שלילית מתוך הגרף",
    "הסבר כיצד השיפוע משפיע על צורת הגרף",
    "רשום את הביטוי האלגברי של הפונקציה"
  ],
  hard: [
    "התבונן בגרף וזהה את סוג הפונקציה",
    "מצא את נקודות החיתוך עם הצירים מתוך הגרף",
    "קבע את שיפוע הפונקציה מתוך הגרף",
    "זהה את התחומים שבהם הפונקציה חיובית/שלילית מתוך הגרף",
    "הסבר כיצד השיפוע והחיתוך עם ציר ה-y משפיעים על צורת הגרף",
    "רשום את הביטוי האלגברי המדויק של הפונקציה"
  ]
};

// New investigation steps for sketch-first mode
export const sketchInvestigations = {
  easy: [
    "קרא את הביטוי האלגברי של הפונקציה",
    "זהה את נקודות החיתוך עם הצירים",
    "קבע את כיוון הפונקציה (עולה/יורדת)",
    "שרטט את הפונקציה",
    "השווה את השרטוט שלך עם הפתרון"
  ],
  medium: [
    "קרא את הביטוי האלגברי של הפונקציה",
    "חשב את נקודות החיתוך עם הצירים",
    "חשב את השיפוע וקבע את כיוון הפונקציה",
    "זהה תחומי חיוביות ושליליות",
    "שרטט את הפונקציה",
    "השווה את השרטוט שלך עם הפתרון והסבר את ההבדלים"
  ],
  hard: [
    "קרא את הביטוי האלגברי של הפונקציה",
    "חשב את נקודות החיתוך עם הצירים",
    "חשב את השיפוע וקבע את כיוון הפונקציה",
    "זהה תחומי חיוביות ושליליות",
    "שרטט את הפונקציה בדיוק מרבי",
    "השווה את השרטוט שלך עם הפתרון והסבר את ההבדלים",
    "הסבר כיצד השיפוע והחיתוך עם ציר ה-y משפיעים על דיוק השרטוט"
  ]
};

// Function-specific investigation steps
export const functionSpecificInvestigations = {
  linear: {
    easy: [
      "זהה את השיפוע של הפונקציה",
      "מצא את נקודת החיתוך עם ציר ה-y",
      "מצא את נקודת החיתוך עם ציר ה-x",
      "קבע האם הפונקציה עולה או יורדת",
      "זהה תחומי חיוביות ושליליות"
    ],
    medium: [
      "חשב את השיפוע של הפונקציה",
      "מצא את נקודות החיתוך עם הצירים",
      "הסבר את הקשר בין השיפוע לבין קצב השינוי",
      "זהה תחומי חיוביות ושליליות",
      "כתוב את משוואת הישר בצורת y=mx+b"
    ],
    hard: [
      "חשב את השיפוע המדויק של הפונקציה",
      "מצא את נקודות החיתוך עם הצירים בדיוק",
      "נתח את הקשר בין השיפוע לזווית עם ציר ה-x",
      "זהה תחומי חיוביות ושליליות",
      "כתוב את משוואת הישר בכל הצורות האפשריות"
    ]
  },
  quadratic: {
    easy: [
      "זהה את כיוון הפתיחה של הפרבולה",
      "מצא את נקודת הקודקוד",
      "מצא את נקודות החיתוך עם הצירים",
      "זהה את ציר הסימטריה",
      "קבע תחומי עלייה וירידה"
    ],
    medium: [
      "מצא את נקודת הקודקוד והסבר את משמעותה",
      "חשב את נקודות החיתוך עם הצירים",
      "זהה את ציר הסימטריה והסבר את תכונותיו",
      "קבע תחומי עלייה, ירידה וחיוביות",
      "נתח את השפעת המקדמים על צורת הגרף"
    ],
    hard: [
      "נתח את השפעת כל מקדם על צורת הפרבולה",
      "חשב את כל נקודות החיתוך והקודקוד בדיוק",
      "הסבר את הקשר בין המקדמים לתכונות הגרף",
      "זהה תחומי עלייה, ירידה וחיוביות",
      "כתוב את משוואת הפרבולה בכל הצורות האפשריות"
    ]
  },
  polynomial: {
    easy: [
      "זהה את דרגת הפולינום",
      "מצא את נקודות החיתוך עם הצירים",
      "זהה נקודות קיצון",
      "קבע תחומי עלייה וירידה",
      "זהה תחומי חיוביות ושליליות"
    ],
    medium: [
      "קבע את דרגת הפולינום והסבר מדוע",
      "מצא את כל נקודות החיתוך והקיצון",
      "זהה נקודות פיתול",
      "נתח תחומי עלייה, ירידה וקעירות",
      "הסבר את התנהגות הפונקציה באינסוף"
    ],
    hard: [
      "נתח את השפעת המקדם המוביל",
      "מצא את כל הנקודות המיוחדות בדיוק",
      "חקור תחומי עלייה, ירידה וקעירות",
      "נתח את התנהגות הפונקציה באינסוף",
      "הסבר את הקשר בין דרגת הפולינום למספר נקודות הקיצון"
    ]
  },
  rational: {
    easy: [
      "זהה אסימפטוטות אנכיות",
      "זהה אסימפטוטה אופקית",
      "מצא נקודות חיתוך עם הצירים",
      "זהה תחומי חיוביות ושליליות",
      "קבע היכן הפונקציה אינה מוגדרת"
    ],
    medium: [
      "מצא את כל האסימפטוטות",
      "חשב נקודות חיתוך עם הצירים",
      "זהה נקודות אי-רציפות",
      "נתח תחומי עלייה וירידה",
      "הסבר את התנהגות הפונקציה ליד האסימפטוטות"
    ],
    hard: [
      "נתח את כל האסימפטוטות כולל אלכסוניות",
      "מצא את כל הנקודות המיוחדות",
      "חקור תחומי עלייה, ירידה ורציפות",
      "נתח התנהגות בסביבת נקודות אי-רציפות",
      "הסבר את הקשר בין מונה למכנה"
    ]
  },
  trigonometric: {
    easy: [
      "זהה את הפונקציה הבסיסית",
      "מצא את המחזוריות",
      "זהה נקודות חיתוך עם הצירים",
      "מצא נקודות קיצון",
      "קבע תחומי חיוביות ושליליות"
    ],
    medium: [
      "זהה את המחזור והתדירות",
      "מצא את המשרעת",
      "חשב הזזות אופקיות ואנכיות",
      "זהה נקודות קיצון ואפסים",
      "נתח תחומי עלייה וירידה"
    ],
    hard: [
      "נתח את כל הפרמטרים של הפונקציה",
      "חשב את כל הנקודות המיוחדות",
      "הסבר את השפעת כל פרמטר",
      "נתח תחומי עלייה, ירידה ומחזוריות",
      "זהה סימטריות וחוקיות"
    ]
  },
  circle: {
    easy: [
      "מצא את מרכז המעגל",
      "חשב את הרדיוס",
      "זהה נקודות חיתוך עם הצירים",
      "קבע האם נקודה נמצאת על המעגל",
      "זהה נקודות רבעים"
    ],
    medium: [
      "חשב את מרכז המעגל והרדיוס",
      "מצא נקודות חיתוך עם הצירים",
      "זהה משיקים בנקודות מיוחדות",
      "חשב היקף ושטח",
      "נתח סימטריות"
    ],
    hard: [
      "נתח את משוואת המעגל המלאה",
      "חשב את כל הנקודות המיוחדות",
      "מצא משוואות משיקים",
      "נתח חיתוך עם ישרים ומעגלים אחרים",
      "חקור תכונות גיאומטריות"
    ]
  }
}; 