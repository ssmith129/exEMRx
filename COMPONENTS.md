# Component Documentation

## Core Components

### InteractiveInput
Advanced form input component with AI suggestions and validation.

**Props:**
- `label: string` - Field label
- `type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'search'` - Input type
- `value: string` - Current value
- `onChange: (value: string) => void` - Change handler
- `aiSuggestion?: object` - AI suggestion with confidence and source
- `options?: string[]` - Options for select/search types
- `error?: string` - Error message
- `success?: boolean` - Success state

**Features:**
- Real-time validation
- AI suggestion integration
- Password visibility toggle
- Search with dropdown
- Accessibility compliant

### InteractiveButton
Enhanced button component with loading states and animations.

**Props:**
- `variant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'` - Button style
- `size: 'sm' | 'md' | 'lg'` - Button size
- `loading?: boolean` - Loading state
- `disabled?: boolean` - Disabled state
- `onClick?: () => void | Promise<void>` - Click handler
- `icon?: ReactNode` - Icon element
- `fullWidth?: boolean` - Full width button

**Features:**
- Async onClick support
- Ripple effects
- Loading animations
- Icon positioning
- Accessibility support

### ResponsiveCard
Flexible card component with collapsible sections.

**Props:**
- `title: string` - Card title
- `subtitle?: string` - Card subtitle
- `collapsible?: boolean` - Enable collapse functionality
- `interactive?: boolean` - Enable click interactions
- `variant: 'default' | 'elevated' | 'outlined' | 'filled'` - Card style
- `actions?: ReactNode` - Action buttons/elements

**Features:**
- Responsive design
- Smooth animations
- Mobile-friendly actions
- Customizable variants

### ActionPanel
Resizable side panel for additional actions and information.

**Props:**
- `title: string` - Panel title
- `position: 'right' | 'left' | 'bottom'` - Panel position
- `size: 'sm' | 'md' | 'lg' | 'xl'` - Panel size
- `resizable?: boolean` - Enable resizing
- `collapsible?: boolean` - Enable collapse
- `actions?: Array` - Footer action buttons

**Features:**
- Drag to resize
- Collapsible interface
- Multiple positions
- Action button integration

## Screen Components

### LoginScreen
Authentication interface with form validation.

**Features:**
- Email/password validation
- Loading states
- Error handling
- Accessibility compliant
- Responsive design

### Dashboard
Main dashboard with statistics and quick actions.

**Features:**
- Statistics cards
- Recent activity feed
- Compliance alerts
- Quick action buttons
- Patient search integration

### SmartCharting
AI-enhanced patient documentation interface.

**Features:**
- AI-suggested form fields
- Confidence indicators
- Auto-save functionality
- Form validation
- Compliance checking
- Collapsible sections

### AIPanel
Intelligent insights and recommendations panel.

**Features:**
- Tabbed interface (Insights/Predictions)
- Confidence scoring
- Source attribution
- Detailed analysis views
- Export capabilities

### ReferralForm
AI-powered specialist referral system.

**Features:**
- AI provider suggestions
- Manual provider search
- Confidence scoring
- Referral form completion
- Success confirmations

### PatientSearch
Advanced patient lookup and selection.

**Features:**
- Real-time search
- Multiple filters
- Patient cards with details
- Selection workflow
- New patient creation

### AppointmentScheduler
Interactive appointment booking system.

**Features:**
- Calendar interface
- Time slot selection
- Provider assignment
- Appointment types
- Booking confirmation

### CaseNotes
Collaborative clinical notes interface.

**Features:**
- Threaded comments
- Editable replies
- Approval workflow
- Status indicators
- Mobile-optimized input

### ComplianceAudit
Real-time compliance checking and reporting.

**Features:**
- Status indicators
- Field validation
- Export options
- Jump to incomplete fields
- Progress tracking

## Design Patterns

### AI UX Patterns
- Confidence scores with explanatory tooltips
- Manual override for all AI suggestions
- Clear source attribution
- Visual distinction between AI and user data
- No automatic overwriting of user input

### Responsive Patterns
- Mobile-first design approach
- Collapsible panels become modals on mobile
- Touch-friendly interactions
- Adaptive layouts
- Sticky elements where appropriate

### Accessibility Patterns
- WCAG AA color contrast
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Error announcements

## State Management

### Form State
- Real-time validation
- Auto-save functionality
- Loading states
- Error handling
- Success feedback

### UI State
- Panel visibility
- Modal management
- Loading indicators
- Selection states
- Navigation state

## Styling Guidelines

### Tailwind Classes
- Use design system tokens from `tailwind.config.js`
- Follow spacing scale (4px increments)
- Maintain consistent border radius
- Use semantic color names

### Component Structure
- Separate concerns (logic, presentation, styling)
- Use TypeScript for all props and state
- Follow React best practices
- Maintain accessibility standards

## Testing Considerations

### Accessibility Testing
- Test with keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Test focus management

### Responsive Testing
- Test across breakpoints
- Verify touch interactions
- Check mobile-specific features
- Test orientation changes

### Functionality Testing
- Test form validation
- Verify AI suggestion workflows
- Test async operations
- Check error handling