# Design System Documentation for reso

## Table of Contents
1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Layout & Grid](#layout--grid)
6. [Components](#components)
7. [Interaction Patterns](#interaction-patterns)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Animation & Motion](#animation--motion)
10. [Technical Implementation](#technical-implementation)
11. [Integration with Music Streaming Services](#integration-with-music-streaming-services)

## Introduction

reso is a social-first, AI-native music discovery platform that connects users through shared musical interests and personalized recommendations. This design system document outlines the UI/UX guidelines and principles that ensure a consistent, intuitive, and engaging user experience across the platform.

Our design approach emphasizes the social connections formed through music while leveraging AI capabilities to enhance discovery and personalization. The interface is crafted to be both visually appealing and highly functional, making music exploration and sharing a seamless experience.

## Design Principles

### Connection-Focused
Design elements should facilitate and highlight connections between users and their music preferences. Visual cues should emphasize shared musical interests and potential new connections.

### Intelligent Simplicity
While the AI technology powering recommendations is complex, the interface should present these sophisticated features in an intuitive and approachable manner.

### Musical Expression
The design should reflect the emotional and expressive nature of music through visual elements, animations, and interactive components.

### Responsive Engagement
Interface elements should provide meaningful feedback and adapt to user behavior, creating a dynamic experience that feels personalized and responsive.

### Accessible Discovery
Music discovery features should be easily accessible throughout the application, encouraging exploration while maintaining a coherent navigation structure.

## Color System

### Primary Palette
- **Sonic Blue** (#3A5CCC): Used for primary actions, highlights, and brand elements
- **Resonance Purple** (#7B42F6): Applied for engagement features and social connections
- **Melody Green** (#22D07A): Indicates successful actions and positive feedback
- **Rhythm Red** (#F24E4E): Reserved for alerts, errors, and critical notifications

### Neutral Palette
- **Deep Bass** (#121212): Primary background for dark mode
- **Mid Tone** (#2A2A2A): Secondary backgrounds and containers
- **High Note** (#E0E0E0): Primary text on dark backgrounds
- **Soft Echo** (#909090): Secondary text and inactive states

### Gradient Systems
- **Harmonic Gradient**: Linear transition from Sonic Blue to Resonance Purple, used for featured content and primary CTAs
- **Acoustic Gradient**: Subtle gradient from Deep Bass to Mid Tone for layered interface elements

### Dark/Light Mode
The platform primarily uses a dark theme to enhance the visual experience of album artwork and music visualizations, with a light theme option available for accessibility preferences.

## Typography

### Font Families
- **Primary Font**: Inter - Used for all UI elements, navigation, and content
- **Display Font**: Manrope - Reserved for headlines, featured content, and branding elements

### Type Scale
- **Headline 1**: Manrope, 32px/40px, Bold - Main page titles
- **Headline 2**: Manrope, 24px/32px, Bold - Section headers
- **Headline 3**: Manrope, 20px/28px, SemiBold - Card titles, modal headers
- **Body 1**: Inter, 16px/24px, Regular - Primary content text
- **Body 2**: Inter, 14px/20px, Regular - Secondary content, descriptions
- **Caption**: Inter, 12px/16px, Medium - Supporting text, timestamps, metadata
- **Button**: Inter, 14px/20px, SemiBold - Action labels, navigation items

### Type Treatments
- Song titles should always be displayed in SemiBold weight
- Artist names should use Regular weight with slightly reduced opacity (85%)
- Interactive text elements should include hover states with color changes or subtle animations

## Layout & Grid

### Responsive Grid System
- **Desktop**: 12-column grid with 24px gutters
- **Tablet**: 8-column grid with 16px gutters
- **Mobile**: 4-column grid with 16px gutters

### Spacing System
Based on an 8px increment system:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

### Container Hierarchy
- **Primary containers**: Full-width sections with 24px padding on desktop, 16px on mobile
- **Secondary containers**: Rounded corners (12px radius), with inner padding of 16px
- **Cards**: 8px radius with 16px padding, subtle elevation shadow

### Layout Patterns
- **Feed Layout**: Vertical scrolling list for music recommendations and social activity
- **Grid Layout**: For displaying album collections, playlists, and artist galleries
- **Split Layout**: For comparison views and collaborative playlist building

## Components

### Navigation Components
- **Main Navigation Bar**: Fixed position, contains logo, search, profile, and primary actions
- **Tab Bar**: Used for switching between major sections (Discover, Library, Social)
- **Sidebar**: Collapsible on desktop, houses playlists, favorites, and secondary navigation
- **Bottom Sheet**: Mobile navigation for quick actions and playback controls

### Music Player Components
- **Mini Player**: Persistent compact player showing current track with basic controls
- **Expanded Player**: Full-screen immersive player with album art, lyrics, and advanced controls
- **Queue Manager**: Draggable list of upcoming tracks with reordering capability
- **Playback Controls**: Consistent design for play/pause, skip, volume across all player variants

### Social Components
- **User Profile Card**: Displays user image, name, and music taste summary
- **Connection Indicator**: Visual representation of musical compatibility between users
- **Sharing Card**: Pre-formatted card for sharing songs with personal context or reaction
- **Activity Feed Item**: Shows user actions, recommendations, and social interactions

### Content Display Components
- **Track Card**: Displays song information with play button and action menu
- **Album Display**: Shows album artwork, title, artist, and year with hover interactions
- **Playlist Grid**: Masonry-style layout for displaying multiple playlists
- **Artist Profile**: Header with artist image, followed by discography and related content

### Input Components
- **Search Bar**: Expandable input with predictive results and filters
- **Reaction Selector**: Quick emoji-style reactions for responding to shared music
- **Comment Field**: Expandable text area for adding context to shared music
- **Filter Controls**: Chip-style selectors for refining recommendations and search results

## Interaction Patterns

### Music Discovery
- **Swipe Actions**: Horizontal swipe to save/skip recommendations
- **Expand Details**: Tap/click to reveal more information about a track or album
- **Contextual Menus**: Long-press or right-click to access additional actions for music items

### Social Interactions
- **Share Flow**: Streamlined process for sending music to connections with optional context
- **Reaction System**: One-tap reactions to shared music that express emotional response
- **Collaborative Creation**: Intuitive interface for building playlists together in real-time

### Personalization
- **Preference Training**: Interactive onboarding to establish initial music preferences
- **Feedback Loop**: Simple mechanisms for users to improve recommendation accuracy
- **Customization Controls**: Settings to adjust discovery algorithms and social features

### Transitions
- **Content Loading**: Skeleton screens instead of spinners for perceived performance
- **View Changes**: Smooth transitions between main application sections
- **Modal Presentations**: Subtle scale and fade animations for dialogs and overlays

## Accessibility Guidelines

### Color Contrast
- All text must maintain a minimum contrast ratio of 4.5:1 against its background
- Interactive elements should have distinct focus and hover states
- Color should never be the sole indicator of meaning or function

### Screen Reader Support
- All interactive elements must have appropriate ARIA labels
- Dynamic content updates should be announced to screen readers
- Custom components must support keyboard navigation

### Keyboard Navigation
- All interactive elements must be accessible via keyboard
- Focus states should be clearly visible
- Logical tab order should be maintained throughout the application

### Text Sizing
- Text should scale appropriately when users adjust browser text size
- No text should be presented as images
- Minimum touch targets of 44×44px for mobile interfaces

## Animation & Motion

### Principles
- **Purpose**: Animations should guide attention and provide feedback, not distract
- **Consistency**: Similar actions should have similar animations
- **Performance**: Animations should prioritize performance, especially on mobile devices

### Microinteractions
- **Button States**: Subtle scale and color changes for hover, active, and focus states
- **Loading States**: Animated indicators that reflect the brand personality
- **Success States**: Celebratory animations for completing actions or discoveries

### Transitions
- **Page Transitions**: Coordinated motion between major view changes
- **List Animations**: Staggered entrance for feed items and search results
- **Player Expansion**: Smooth transition between mini player and full-screen player

### Music Visualizations
- **Playback Indicators**: Subtle animations that respond to currently playing music
- **Recommendation Transitions**: Fluid movements between recommendation cards
- **Collaborative Indicators**: Visual feedback when multiple users interact with shared content

## Technical Implementation

### Component Library
reso uses shadcn/ui as the foundation for UI components, customized to match our design system. This provides a consistent, accessible component set that can be extended as needed.

### CSS Implementation
- TailwindCSS for utility-based styling
- Custom design tokens defined in the Tailwind configuration
- Consistent class naming conventions for custom components

### Responsive Strategy
- Mobile-first approach to CSS and component design
- Strategic breakpoints at 640px, 768px, 1024px, and 1280px
- Fluid typography and spacing that scales with viewport

### State Management
- React Query for server state management
- Context API for UI state and theme preferences
- Local component state for isolated interactions

### Animation Implementation
- Framer Motion for complex animations and transitions
- CSS transitions for simple hover and focus states
- Controlled animation timing to maintain performance

## Integration with Music Streaming Services

### Authentication Flows
- Clean, branded OAuth screens for connecting to Spotify and Apple Music
- Clear permission explanations and privacy reassurances
- Seamless account linking with minimal friction

### Service-Specific UI Adaptations
- Consistent playback controls regardless of connected service
- Service indicators that show the source of content without dominating the interface
- Graceful fallbacks for features not supported by all services

### Cross-Platform Consistency
- Maintain design language consistency across web and mobile platforms
- Adapt patterns for platform-specific conventions where necessary
- Ensure responsive design works across all device types and orientations

---

This design system serves as a living document and will evolve as reso grows. All team members are encouraged to contribute to its development while maintaining the core principles that define our user experience.

## Resources

- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js documentation covering routing, SSR, and React integration.
- [React Documentation](https://react.dev/reference/react) - Official React.js documentation for component-based design patterns.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework for consistent styling and responsive design.
- [Framer Motion Documentation](https://framer-motion.dev) - Animation library for React, enabling motion design components.
- [shadcn/ui](https://github.com/chakra-ui/shadcn-ui) - Customizable React UI component library for production-grade interfaces.
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction) - Tool for building and testing isolated UI components with Figma integration.
- [Supernova Documentation](https://www.supernova.io/docs) - Platform for maintaining design system documentation with Figma sync.