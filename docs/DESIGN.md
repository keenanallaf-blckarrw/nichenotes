# Design principles

NicheNotes is designed the way Steve Jobs described good products. Each principle below comes with the rule it sets for this codebase.

## 1. Focus means saying no

> "It means saying no to the hundred other good ideas." (WWDC, 1997)

- One primary action per card and per screen. On a find it's **Shop**; everything else is secondary or tucked into the ••• menu.
- A feature gets built only if it earns its place. Removed in v0.2: the live taste meter in the feed header, catalog numbers, "hang tag" card chrome, Roman-numeral dates, the this-or-that onboarding step, the username step and the inline share button.

## 2. Simple is harder than complex

> "You have to work hard to get your thinking clean to make it simple." (BusinessWeek, 1998)

- **One typeface family:** the system font (San Francisco on Apple devices). One serif (New York) is reserved for quotes. No uppercase labels, no monospace.
- **One accent color,** used only for things you can tap.
- **Plain words anyone in the world understands.** Say "Soccer," not "Football." Say "jersey," not "kit." Say "Clubs," not "Crews." Say "Saved," not "Stash." No slang or regional idioms.

## 3. Design is how it works

> "Design is not just what it looks like and feels like. Design is how it works." (The New York Times Magazine, 2003)

- Onboarding takes two steps: pick what you're into, then pick whose words you want each morning (or a mix of everything).
- The feed learns silently. It only tells you why you're seeing something when the reason is interesting: you saved something similar, it's new for you, two of your interests crossed, or it's a paid partner.
- Every other reason is still one tap away in the ••• menu, under **Why am I seeing this?**

## 4. Made for everyone

Apple builds accessibility into every product, because a product that shuts people out is not finished.

- **For every kind of person.** There are 59 interests, not just one lifestyle. Copy never assumes gender, age, body or background.
- **Readable.** All text is sized in rem, so it grows with the text-size setting in You › Display and with the device's own setting. Secondary text meets WCAG AA contrast.
- **Easy to tap.** Every icon button is at least 44 × 44 points.
- **Respectful of settings.** Dark mode and reduced motion follow the device automatically unless the person chooses otherwise.
- **Labeled.** Every control has a text label a screen reader can announce.

## 5. Let the product be the hero

- Product images are big, on a clean neutral background, and consistent from card to card.
- Chrome recedes. Separate things with space and hairlines, not boxes, shadows and borders.
- Large titles at the top of each screen, like the system apps.

## 6. Care about the back of the fence

Jobs's father taught him to finish the back of a fence as well as the front, even though no one would see it.

- The code nobody sees gets the same care as the screens:
  - the engine stays pure and tested
  - colors come only from tokens
  - names in code match the words on screen (a club is `club` everywhere, never `crew`)
- Light and dark mode are both designed, not inverted.

## The system

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | #FFFFFF | #000000 | Page |
| `surface` | #F5F5F7 | #1C1C1E | Grouped content, quote cards |
| `tile` | #F5F5F7 | #E5E5EA | Product image backgrounds (stay light, like photos) |
| `ink` | #1D1D1F | #F5F5F7 | Primary text |
| `ink-2` | #6E6E73 | #A1A1A6 | Secondary text |
| `line` | #D2D2D7 | #38383A | Hairlines |
| `accent` | #1464F4 | #1A6BFF | Buttons and links |

- **Type scale** (in rem, shown here in points at default size):
  - Large title 34 bold
  - Title 28 bold
  - Title 2 22 semibold
  - Headline 17 semibold
  - Body 17
  - Subhead 15
  - Footnote 13
- **Radius:** 12 for controls, 20 for cards and images.
- **Spacing:** multiples of 4.
