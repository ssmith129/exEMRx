# ezEMRx - Electronic Health Record System

A modern, AI-enhanced Electronic Health Record system designed for public health clinics, featuring WIC nutrition assessments, immunization tracking, and comprehensive patient management.

## Features

- **AI-Powered Smart Charting** - Intelligent form filling with confidence indicators
- **Advanced Patient Search** - Quick patient lookup with filtering capabilities
- **Referral Management** - AI-suggested specialist referrals with provider matching
- **Compliance Auditing** - Real-time compliance checking with export capabilities
- **Case Notes Collaboration** - Threaded comments with approval workflows
- **Responsive Design** - Mobile-first design that works across all devices
- **Accessibility Compliant** - WCAG AA compliant with full keyboard navigation

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Netlify

## Design System

### Typography
- **Headings**: Inter Bold/SemiBold (24px/22px/20px)
- **Body Text**: Open Sans (14-16px)
- **Line Height**: 1.5x for all text

### Color Palette
- **Primary**: #3C8C78 (Healthcare Green)
- **Error**: #D9534F
- **Success**: #28A745
- **Background**: #F9F9F9
- **Text**: #2C2C2C

### Layout System
- **Grid**: 12-column responsive grid
- **Spacing**: 4px scale (8px, 16px, 24px, 32px, 48px)
- **Border Radius**: 6px standard, 8-12px for cards
- **Breakpoints**: 768px (tablet), 1024px (desktop)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main application layout
│   ├── LoginScreen.tsx  # Authentication interface
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── SmartCharting.tsx # AI-enhanced charting
│   ├── AIPanel.tsx      # AI insights panel
│   ├── ReferralForm.tsx # Referral management
│   ├── CaseNotes.tsx    # Collaborative notes
│   ├── ComplianceAudit.tsx # Compliance checking
│   ├── PatientSearch.tsx # Patient lookup
│   ├── AppointmentScheduler.tsx # Scheduling
│   ├── InteractiveInput.tsx # Enhanced form inputs
│   ├── InteractiveButton.tsx # Interactive buttons
│   ├── ResponsiveCard.tsx # Responsive card component
│   ├── ActionPanel.tsx  # Resizable action panels
│   └── AIInsightDetails.tsx # Detailed AI analysis
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or extract the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Login
- Use any email/password combination to access the system
- The login form includes validation and loading states

### Navigation
- Use the sidebar navigation to access different modules
- Click the user icon in the header for global patient search
- All navigation is keyboard accessible

### Smart Charting
- AI suggestions appear with confidence indicators
- Click "Accept" to use AI suggestions or "Override" to enter manually
- Forms auto-save every 2 seconds
- Use the AI Assistant panel for detailed insights

### Patient Management
- Search patients by name, MRN, or phone number
- Use filters to narrow down patient lists
- Schedule appointments directly from patient records

### Referrals
- AI suggests appropriate specialists based on patient data
- Search for additional providers manually
- Complete referral forms with priority levels

### Compliance
- Real-time compliance checking during documentation
- Export compliance reports in PDF or CSV format
- Jump directly to incomplete fields

## Customization

### Theming
Modify `tailwind.config.js` to customize colors, spacing, and other design tokens.

### Components
All components are modular and can be easily customized or extended.

### AI Integration
AI suggestions are currently simulated. Replace with actual AI service calls in production.

## Accessibility

- Full keyboard navigation support
- WCAG AA color contrast compliance
- Screen reader compatible with ARIA labels
- Focus management and visual indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and component patterns
2. Ensure all new components are responsive and accessible
3. Add proper TypeScript types for all props and state
4. Test across different screen sizes and devices

## License

This project is for demonstration purposes. Please ensure compliance with healthcare regulations (HIPAA, etc.) before using in production.

## Support

For questions or issues, please refer to the component documentation within each file or create an issue in your project repository.