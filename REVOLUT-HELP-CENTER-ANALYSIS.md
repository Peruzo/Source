# Revolut Help Center Design Analysis

## Overview
Analysis of Revolut's Swedish help center (help.revolut.com/sv-SE) focusing on layout design, question categorization, and search functionality.

---

## 1. Layout Design

### 1.1 Visual Hierarchy

**Top Section - Search Bar:**
- **Prominent placement**: Search bar positioned at the very top of the page
- **Clear call-to-action**: Text "Ställ din fråga nedan för att få svar" (Ask your question below to get answers)
- **Primary interaction point**: Makes search the first and most visible action
- **Design**: Large, accessible input field that stands out visually

**Middle Section - Category Grid:**
- **Card-based layout**: Categories presented as individual cards/tiles
- **Visual organization**: Clear separation between different topic areas
- **Scannable design**: Users can quickly identify relevant categories
- **Icon/visual support**: Likely uses icons or visual cues for each category

**Bottom Section - Package Selection:**
- **Product integration**: Shows different Revolut packages with descriptions and pricing
- **Contextual placement**: Helps users understand product tiers while seeking help

### 1.2 Design Principles Applied

1. **Progressive Disclosure**: Start with search, then reveal categories, then details
2. **Visual Hierarchy**: Search → Categories → Details → Products
3. **White Space**: Generous spacing between elements for clarity
4. **Consistency**: Uniform card styling across categories
5. **Accessibility**: Large touch targets, clear typography

---

## 2. Question Categorization Strategy

### 2.1 Category Structure

Revolut organizes help content into **13 main categories**:

#### Core Account & Setup
- **Profil och paket** (Profile and packages)
  - Getting started with Revolut
  - Different packages and benefits
  - Document submission

#### Security & Safety
- **Säkerhet och bedrägeri** (Security and fraud)
  - Device integrity
  - Reporting fraudulent ATM withdrawals
  - Reporting suspicious calls, emails, links, or SMS

#### Card Management
- **Kort** (Cards)
  - Card ordering and delivery
  - Lost or stolen cards
  - Card-related issues

#### Payments & Transactions
- **Kortbetalningar och kontantuttag** (Card payments and cash withdrawals)
  - Card payments
  - Cash withdrawals
  - Spending abroad or in different currencies

#### Account Types
- **Konton** (Accounts)
  - Currency accounts
  - Savings accounts with instant access
  - Flexible money funds

#### Transfers
- **Överföringar** (Transfers)
  - Bank transfers
  - Basic information
  - Handling failed transfers
  - Other transfer-related issues

#### Cryptocurrency
- **Krypto** (Crypto)
  - Crypto staking
  - Supported addresses for withdrawals
  - Recovery of crypto deposits
  - Ownership verification for senders or recipients

#### Funding
- **Lägga till pengar** (Adding money)
  - Bank transfers
  - Card payments
  - Apple Pay or Google Pay

#### Investment
- **Investera** (Invest)
  - Managing investment accounts
  - Available trading products and services
  - Executing trade orders
  - Fees and limits

#### Rewards & Benefits
- **RevPoints**
  - What RevPoints are
  - Flight points
  - eSIM

#### Insurance
- **Försäkring** (Insurance)
  - Travel insurance
  - Everyday protection insurance
  - Cancellation protection for travel and events with Ultra

#### Lifestyle
- **Livsstil** (Lifestyle)
  - Fast track for airport controls

#### Referrals
- **Inbjudningar** (Invitations)
  - Invitation rewards
  - Help for invited users
  - Additional support for invitations

#### Miscellaneous
- **Andra ämnen** (Other topics)
  - Lost access to passkey
  - Devices where passkey is stored
  - Features supported in web app

### 2.2 Categorization Principles

1. **User Journey Based**: Categories follow natural user flows (setup → usage → advanced features)
2. **Task-Oriented**: Grouped by what users want to accomplish
3. **Product-Feature Mapping**: Each major product feature gets its own category
4. **Scalable Structure**: Easy to add new categories as products evolve
5. **Cross-Referencing**: Some topics may appear in multiple categories

---

## 3. Search Bar Functionality

### 3.1 Search Design

**Visual Design:**
- Large, prominent input field
- Clear placeholder text or instruction
- Search icon for visual recognition
- Accessible design (keyboard navigation, screen reader support)

**Functionality:**
- **Real-time search**: Likely provides suggestions as user types
- **Keyword matching**: Searches across questions, answers, and categories
- **Fuzzy matching**: Handles typos and variations
- **Category filtering**: Results may be grouped by category
- **Relevance ranking**: Most relevant results appear first

### 3.2 Search UX Flow

1. **User types query** → Search bar
2. **Suggestions appear** → Dropdown with matching questions/categories
3. **User selects or submits** → Results page or direct answer
4. **Results displayed** → Filtered by relevance, category, or both

### 3.3 Search Features (Likely Implemented)

- **Autocomplete**: Suggests common questions
- **Category tags**: Results show which category they belong to
- **Highlighting**: Matching keywords highlighted in results
- **Popular searches**: May show trending or frequently asked questions
- **No results handling**: Helpful suggestions when no matches found

---

## 4. Key Design Patterns

### 4.1 Information Architecture

```
Homepage
├── Search Bar (Primary CTA)
├── Category Grid
│   ├── Category Card 1
│   ├── Category Card 2
│   └── ...
├── Individual Category Page
│   ├── Category description
│   ├── Related questions
│   └── Search within category
└── Individual Question Page
    ├── Question
    ├── Answer
    ├── Related questions
    └── Feedback (helpful/not helpful)
```

### 4.2 Navigation Patterns

1. **Breadcrumbs**: Show path (Home > Category > Question)
2. **Related questions**: Suggest similar questions at bottom
3. **Category navigation**: Easy return to category or home
4. **Search persistence**: Search bar available on all pages

### 4.3 User Experience Enhancements

- **Quick access**: Most common questions easily accessible
- **Progressive disclosure**: Details revealed on demand
- **Contextual help**: Related information surfaced automatically
- **Feedback loops**: Users can rate helpfulness of answers

---

## 5. Comparison with Current Implementation

### Current FAQ Component (Source)

**Strengths:**
- ✅ Clean accordion design
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Good visual hierarchy

**Areas for Improvement (Based on Revolut Analysis):**

1. **Missing Search Functionality**
   - No search bar to filter questions
   - Users must scroll through all FAQs

2. **No Categorization**
   - All questions in a flat list
   - No grouping by topic (e.g., "Getting Started", "Pricing", "Technical")

3. **Limited Scalability**
   - As FAQ grows, flat list becomes unwieldy
   - Hard to find specific information

4. **No Related Questions**
   - Missing cross-referencing between related topics

---

## 6. Recommendations for Implementation

### 6.1 Add Search Functionality

```typescript
// Search bar component
- Real-time filtering as user types
- Highlight matching keywords
- Show "No results" state with suggestions
- Clear search button
```

### 6.2 Implement Categorization

```typescript
// Category structure
const categories = [
  {
    id: 'getting-started',
    name: 'Komma igång',
    icon: '🚀',
    questions: [...]
  },
  {
    id: 'pricing',
    name: 'Priser och paket',
    icon: '💰',
    questions: [...]
  },
  {
    id: 'technical',
    name: 'Teknisk support',
    icon: '⚙️',
    questions: [...]
  },
  // ... more categories
]
```

### 6.3 Enhanced Layout

```
1. Hero section with search bar (prominent)
2. Category grid (visual cards)
3. Featured/Common questions (quick access)
4. Full FAQ list (expandable by category)
```

### 6.4 Search Features

- **Fuzzy search**: Handle typos
- **Category filtering**: Filter results by category
- **Popular searches**: Show trending questions
- **Search history**: Remember recent searches (optional)

---

## 7. Implementation Priority

### Phase 1: Essential
1. ✅ Add search bar with real-time filtering
2. ✅ Implement basic categorization
3. ✅ Update FAQ data structure

### Phase 2: Enhanced UX
4. ✅ Category-based navigation
5. ✅ Related questions
6. ✅ Search result highlighting

### Phase 3: Advanced
7. ✅ Search analytics
8. ✅ Popular questions
9. ✅ Search suggestions/autocomplete

---

## 8. Technical Considerations

### Search Implementation Options

1. **Client-side filtering** (Simple, fast for small datasets)
   - Use `filter()` and `includes()` for basic search
   - Good for < 100 questions

2. **Fuse.js** (Fuzzy search library)
   - Better typo tolerance
   - Relevance scoring
   - Good for 100-1000 questions

3. **Full-text search** (For large datasets)
   - Algolia, Typesense, or similar
   - Best for 1000+ questions
   - Requires backend integration

### Data Structure

```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  related?: string[]; // IDs of related questions
  helpful?: number; // Count of helpful votes
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}
```

---

## 9. Design Mockup Structure

```
┌─────────────────────────────────────┐
│  [Search Bar - Large, Prominent]   │
│  "Ställ din fråga nedan..."        │
└─────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Category │ │ Category │ │ Category │
│   Card   │ │   Card   │ │   Card   │
└──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────┐
│  Vanliga frågor (Common Questions)  │
│  ┌───────────────────────────────┐ │
│  │ Q: Question 1?          [↓]   │ │
│  │ A: Answer...                  │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Q: Question 2?          [↓]   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 10. Key Takeaways

1. **Search First**: Make search the primary interaction point
2. **Categorize Everything**: Group questions by user intent and topic
3. **Visual Hierarchy**: Clear progression from search → categories → details
4. **Scalable Structure**: Design for growth (10 → 100 → 1000 questions)
5. **User-Centric**: Organize by what users want to do, not by product features
6. **Progressive Disclosure**: Show overview first, details on demand
7. **Contextual Help**: Surface related information automatically

---

## Next Steps

1. Review this analysis
2. Decide on categorization structure for Source
3. Implement search functionality
4. Update FAQ component with categories
5. Test with real users
6. Iterate based on search analytics







